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
    private Dictionary<string, List<Dictionary<string, RateTimeSeriesResponse>>> MemoRangeByCurrTimeSeriesLists { get; set; } = new(); // memo the different range of timeSeries object
    
    public CurrService(IEnumerable<IExchangeRateApiClient> exchangeRateApiClients, ILogger<CurrService> logger, IWebHostEnvironment env)
    {
        _exchangeRateApiClients = exchangeRateApiClients is null ? new List<IExchangeRateApiClient>() : exchangeRateApiClients.ToList();
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
        
        timeSeriesRange = timeSeriesRange.Any() ? timeSeriesRange : "1d";
        targetCurr = targetCurr.Any() ? targetCurr : "USD";
        baseCurr = targetCurr.Any() ? baseCurr : "CAD";
        
        _logger.LogInformation("Fetch saved Time Series!!!");
        targetCurrTimeSeries = FetchExistedTimeSeries(timeSeriesRange, targetCurr, isNewUpdateRequest);

        if (targetCurrTimeSeries == null) // fetch new time series update
        {
            targetCurrTimeSeries = await FetchNewTimeSeriesUpdate(baseCurr, targetCurr, timeSeriesRange);
            UpdateMemoRangeByCurrTimeSeriesLists(timeSeriesRange, targetCurrTimeSeries);
        }

        return targetCurrTimeSeries;
    }

    public Dictionary<string, RateTimeSeriesResponse> FetchExistedTimeSeries(string timeSeriesRange, string targetCurr, bool isNewUpdateRequest)
    {
        // return the prev retrieved timeSeries object if not require any new update of timeSeries object
        if (isNewUpdateRequest || !MemoRangeByCurrTimeSeriesLists.ContainsKey(timeSeriesRange))
            return null;

        timeSeriesRange = timeSeriesRange.Any() ? timeSeriesRange : "1d";
        targetCurr = targetCurr.Any() ? targetCurr : "CAD";
        
        List<Dictionary<string, RateTimeSeriesResponse>> allCurrTimeSeriesList = MemoRangeByCurrTimeSeriesLists[timeSeriesRange];
        
        // in case the key is exist but store nothing as its value
        if (allCurrTimeSeriesList is null || !allCurrTimeSeriesList.Any())
            return null;
        
        return allCurrTimeSeriesList.FirstOrDefault(t => t.Keys.Equals(targetCurr));
    }

    public async Task<Dictionary<string, RateTimeSeriesResponse>> FetchNewTimeSeriesUpdate(string baseCurr, string targetCurr, string timeSeriesRange)
    {
        foreach (var apiClientElement in _exchangeRateApiClients)
        {
            try
            {
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
        Dictionary<string, RateTimeSeriesResponse> targetCurrTimeSeries = timeseriesTransformer.TransformedData(LatestTimeSeriesUpdate, targetCurr, timeSeriesRange);
        return targetCurrTimeSeries;
    }

    public void UpdateMemoRangeByCurrTimeSeriesLists(string timeSeriesRange, Dictionary<string, RateTimeSeriesResponse> targetCurrTimeSeries)
    {
        if (targetCurrTimeSeries is null)
            targetCurrTimeSeries = new Dictionary<string, RateTimeSeriesResponse>();

        timeSeriesRange = timeSeriesRange.Any() ? timeSeriesRange : "1d";
        
        // Added new currTimeSeries to memo list if not existed yet, else if contain then
        if (MemoRangeByCurrTimeSeriesLists.ContainsKey(timeSeriesRange))
        {
            // get all the curr code's timeSerie object bases on the same time range
            List<Dictionary<string, RateTimeSeriesResponse>> targetMemoTimeSeriesList = MemoRangeByCurrTimeSeriesLists[timeSeriesRange];
            if (targetMemoTimeSeriesList == null || !targetMemoTimeSeriesList.Any())
            {
                // the new value that assign to allCurrTimeSeriesList is equivalent as store to memo object (RangeByCurrTimeSeriesLists[timeSeriesRange])
                targetMemoTimeSeriesList = new List<Dictionary<string, RateTimeSeriesResponse>>();
                targetMemoTimeSeriesList.Add(targetCurrTimeSeries);
                MemoRangeByCurrTimeSeriesLists[timeSeriesRange] = targetMemoTimeSeriesList;
            }
            else
            {
                int i;
                for (i = 0; i < targetMemoTimeSeriesList.Count(); i++)
                {
                    // if the currTimeSeries's key, currCode, existed in the list, update its value and stop iteration
                    if (targetMemoTimeSeriesList[i].Keys.Equals(targetCurrTimeSeries.Keys))
                    {
                        targetMemoTimeSeriesList[i] = targetCurrTimeSeries;
                        return;
                    }
                }

                // add the new currCode's timeSeries to memo if the currCode of that timeRange is not existed yet
                if (i == targetMemoTimeSeriesList.Count())
                    targetMemoTimeSeriesList.Add(targetCurrTimeSeries);
            }
        }
        else
        {
            List<Dictionary<string, RateTimeSeriesResponse>> tempList = new() { targetCurrTimeSeries };
            MemoRangeByCurrTimeSeriesLists.Add(timeSeriesRange, tempList);
        }
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