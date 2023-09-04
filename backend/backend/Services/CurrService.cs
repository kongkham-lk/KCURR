using System.Globalization;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class CurrService
{
    private readonly List<IExchangeRateApiClient> _exchangeRateApiClients;

    public CurrService(IEnumerable<IExchangeRateApiClient> exchangeRateApiClients)
    {
        _exchangeRateApiClients = exchangeRateApiClients.ToList();
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
        Dictionary<string, CurrCountriesResponse> currCountries = null!;
        foreach (var apiClientElement in _exchangeRateApiClients)
        {
            try
            {
                currCountries = await apiClientElement.GetCurrCountries();
            }
            catch (Exception e)
            {
                continue;
            }
        }
        return currCountries;
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
}