using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class CurrService
{
    private readonly List<IExchangeRateApiClient> _exchangeRateApiClients;
    private readonly ILogger<CurrService> _logger;
    private readonly IWebHostEnvironment _env;
    private int TotalRetryApiKey { get; set; } = 3;
    private Dictionary<string, double> LatestRates { get; set; } = new();
    private SortedList<string, double> LatestTimeSeriesUpdate { get; set; } = null; // the longest timeSeries Object for each new update request from frontend
    private Dictionary<string, List<Dictionary<string, RateTimeSeriesResponse>>> RangeByCurrTimeSeriesLists { get; set; } = new(); // memo the different range of timeSeries object

    public CurrService(IEnumerable<IExchangeRateApiClient> exchangeRateApiClients, ILogger<CurrService> logger, IWebHostEnvironment env)
    {
        _exchangeRateApiClients = exchangeRateApiClients.ToList();
        _logger = logger;
        _env = env;
    }

    public async Task<double> Convert(double amount, string baseCurrCountry, string targetCurrCountry)
    {
        double rate = await CheckRate(baseCurrCountry, targetCurrCountry);
        return amount * rate;
    }

    private async Task<double> CheckRate(string baseCurr, string targetCurr)
    {
        Dictionary<string, double> rates = await GetLatestExchangeRates(baseCurr);
        return rates[targetCurr];
    }

    public async Task<Dictionary<string, double>> GetLatestExchangeRates(string baseCurr)
    {
        RateGetter rateGetter = new RateGetter(_exchangeRateApiClients);
        LatestRates = await rateGetter.GetRates(baseCurr, RateGetter.Mode.Latest);
        return LatestRates;
    }

    public async Task<Dictionary<string, double>> GetHistoricalExchangeRates(string baseCurr)
    {
        RateGetter rateGetter = new RateGetter(_exchangeRateApiClients);
        Dictionary<string, double> rates = await rateGetter.GetRates(baseCurr, RateGetter.Mode.Historical);
        return rates;
    }

    public async Task<Dictionary<string, CurrCountriesResponse>> GetCurrCountries()
    {
        Dictionary<string, CurrCountriesResponse> currCountries = null!;
        foreach (var apiClientElement in _exchangeRateApiClients)
        {
            try
            {
                TotalRetryApiKey--;
                currCountries = await apiClientElement.GetCurrCountries(false);
            }
            catch (Exception e)
            {
                currCountries = await RetryToGetCurrCountries(apiClientElement, currCountries);

                if (currCountries is null)
                {
                    _logger.LogInformation("Cannot retrieve CurrCountries: " + e);
                    Console.WriteLine("Cannot retrieve CurrCountries: " + e);
                }
            }
        }
        return currCountries;
    }

    public async Task<Dictionary<string, RateTimeSeriesResponse>> GetExchangeRatesTimeSeries(string baseCurr, string targetCurr, string timeSeriesRange, bool isNewUpdateRequest)
    {
        Dictionary<string, RateTimeSeriesResponse> targetCurrTimeSeries;
        
        // return the prev retrieved timeSeries object when not require to update the current stored timeSeries object
        if (!isNewUpdateRequest && RangeByCurrTimeSeriesLists.ContainsKey(timeSeriesRange))
        {
            List<Dictionary<string, RateTimeSeriesResponse>> allCurrTimeSeriesList = RangeByCurrTimeSeriesLists.FirstOrDefault(t => t.Key.Equals(timeSeriesRange)).Value;
            targetCurrTimeSeries = allCurrTimeSeriesList.FirstOrDefault(t => t.Keys.Equals(targetCurr));
            
            // fetch new timeSerie object when it is not existed
            if (targetCurrTimeSeries != null)
                return targetCurrTimeSeries;
        }

        foreach (var apiClientElement in _exchangeRateApiClients)
        {
            try
            {
                if (isNewUpdateRequest) // only retrieve timeSeries once every new update request from frontend
                    LatestTimeSeriesUpdate = await apiClientElement.GetExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange);
            }
            catch (Exception e)
            {
                _logger.LogInformation("Cannot retrieve Curr TimeSeries: " + e);
                Console.WriteLine("Cannot retrieve Curr TimeSeries: " + e);
            }
        }

        IWebHostEnvironment? tempEnv = _env.IsDevelopment() ? _env : null;
        TimeseriesTransformer timeseriesTransformer = new TimeseriesTransformer(_exchangeRateApiClients, tempEnv);
        targetCurrTimeSeries = timeseriesTransformer.TransformedData(LatestTimeSeriesUpdate, targetCurr, timeSeriesRange);

        // Added new currTimeSeries to memo list if not existed yet, else if contain then
        if (RangeByCurrTimeSeriesLists.ContainsKey(timeSeriesRange))
        {
            // get all the curr code's timeSerie object bases on the same time range
            List<Dictionary<string, RateTimeSeriesResponse>> allCurrTimeSeriesList = RangeByCurrTimeSeriesLists[timeSeriesRange];
            if (allCurrTimeSeriesList.Any())
            {
                int i;
                for (i = 0; i < allCurrTimeSeriesList.Count(); i++)
                {
                    // if the currTimeSeries's key existed in the list, update its value and stop iteration
                    if (allCurrTimeSeriesList[i].Keys.Equals(targetCurrTimeSeries.Keys))
                    {
                        allCurrTimeSeriesList[i] = targetCurrTimeSeries;
                        break;
                    }
                }
                
                // add the new currCode's timeSeries to memo if the currCode of that timeRange is not existed yet
                if (i == allCurrTimeSeriesList.Count())
                    allCurrTimeSeriesList.Add(targetCurrTimeSeries);
            }
            else
                // the new value that assign to allCurrTimeSeriesList is equivalent as store to memo object (RangeByCurrTimeSeriesLists[timeSeriesRange])
                allCurrTimeSeriesList = new List<Dictionary<string, RateTimeSeriesResponse>>() { targetCurrTimeSeries };
        }
        else
        {
            List<Dictionary<string, RateTimeSeriesResponse>> tempList = new() { targetCurrTimeSeries };
            RangeByCurrTimeSeriesLists.Add(timeSeriesRange, tempList);
        }
        return targetCurrTimeSeries;
    }

    private async Task<Dictionary<string, CurrCountriesResponse>> RetryToGetCurrCountries(IExchangeRateApiClient apiClientElement, Dictionary<string, CurrCountriesResponse> response)
    {
        while (TotalRetryApiKey > 0 && response is null)
        {
            response = await apiClientElement.GetCurrCountries(true); // invoke method again by trying to use another api key
            TotalRetryApiKey--;

            if (response is not null)
                break;
            else if (TotalRetryApiKey == 0)
                _logger.LogInformation($"None of the currCountries api key works!!!");
        }
        TotalRetryApiKey = 3; // reset total retry api key when data return
        return response;
    }
}