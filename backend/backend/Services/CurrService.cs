using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class CurrService
{
    private readonly List<IExchangeRateApiClient> _exchangeRateApiClients;
    private readonly ILogger<CurrService> _logger;
    private int TotalRetryApiKey { get; set; } = 3;

    public CurrService(IEnumerable<IExchangeRateApiClient> exchangeRateApiClients, ILogger<CurrService> logger)
    {
        _exchangeRateApiClients = exchangeRateApiClients.ToList();
        _logger = logger;
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
        Dictionary<string, double> rates = await rateGetter.GetRates(baseCurr, RateGetter.Mode.Latest);
        return rates;
    }

    public async Task<Dictionary<string, double>> GetHistoricalExchangeRates(string baseCurr)
    {
        RateGetter rateGetter = new RateGetter(_exchangeRateApiClients);
        Dictionary<string, double> rates = await rateGetter.GetRates(baseCurr, RateGetter.Mode.Historical);
        return rates;
    }

    public async Task<Dictionary<string, CurrCountriesResponse>> GetCurrCountries()
    {
        if (TotalRetryApiKey > 0)
        {
            Dictionary<string, CurrCountriesResponse> currCountries = null!;
            foreach (var apiClientElement in _exchangeRateApiClients)
            {
                try
                {
                    currCountries = await apiClientElement.GetCurrCountries(false);
                    TotalRetryApiKey--;

                    if (currCountries is null)
                        currCountries = await RetryToGetCurrCountries(apiClientElement, currCountries);
                }
                catch (Exception e)
                {
                    _logger.LogInformation(e.ToString());
                }
            }
            return currCountries;
        }
        return null;
    }

    public async Task<Dictionary<string, RateTimeSeriesResponse>> GetExchangeRatesTimeSeries(string baseCurr,
        string targetCurr, string timeSeriesRange)
    {
        SortedList<string, double> timeSeries = null!;
        foreach (var apiClientElement in _exchangeRateApiClients)
        {
            try
            {
                timeSeries = await apiClientElement.GetExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange);
            }
            catch (Exception e)
            {
                continue;
            }
        }

        TimeseriesTransformer timeseriesTransformer = new TimeseriesTransformer(_exchangeRateApiClients);
        Dictionary<string, RateTimeSeriesResponse> targetCurrTimeSeries =
            timeseriesTransformer.TransformedData( timeSeries, targetCurr);
        return targetCurrTimeSeries;
    }

    private async Task<Dictionary<string, CurrCountriesResponse>> RetryToGetCurrCountries(IExchangeRateApiClient apiClientElement, Dictionary<string, CurrCountriesResponse> currCountries)
    {
        while (TotalRetryApiKey > 0 && currCountries is null)
        {
            currCountries = await apiClientElement.GetCurrCountries(true); // invoke method again by trying to use another api key
            TotalRetryApiKey--;

            if (currCountries is not null)
            {
                TotalRetryApiKey = 3; // reset total retry api key when data return
                break;
            }
            else if (TotalRetryApiKey == 0)
                _logger.LogInformation($"None of the Key works!!!");
        }
        return currCountries;
    }
}