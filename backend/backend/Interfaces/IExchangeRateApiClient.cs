using backend.Models;

namespace backend.Interfaces;

public interface IExchangeRateApiClient
{
    Task<Dictionary<string, double>> GetLatestExchangeRates(string baseCurr);
    Task<Dictionary<string, double>> GetHistoricalExchangeRates(string baseCurr);
    Task<Dictionary<string, CurrCountriesResponse>> GetCurrCountries();
    Task<SortedList<string, double>> GetExchangeRatesTimeSeries(string baseCurr, string targetCurr, string timeSeriesRange);
}