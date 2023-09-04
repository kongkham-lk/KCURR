using System.Globalization;
using backend.Interfaces;
using backend.Models;

namespace backend.ApiClients.CurrencyBeacon;

public class CurrencyBeaconApiClient : IExchangeRateApiClient
{
    private readonly HttpClient _httpClient;
    private readonly string _currencyBeaconApiKey;

    public CurrencyBeaconApiClient(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        ApiKeysProvider apiKeysProvider = new ApiKeysProvider();
        _currencyBeaconApiKey = apiKeysProvider.GetApiKey(ApiKeysProvider.ApiName.CurrencyBeaconApiKey);
        // _currencyBeaconApiKey = configuration["ApiKeys:CurrencyBeaconApiKey"];
    }

    public async Task<Dictionary<string, double>> GetLatestExchangeRates(string baseCurr)
    {
        var url = "https://api.currencybeacon.com/v1/latest?api_key=" + _currencyBeaconApiKey + "&base=" + baseCurr;
        var exchangeRateApiResponse = await _httpClient.GetFromJsonAsync<CurrencyBeaconExchangeRateApiResponse>(url);
        var currMapRates = exchangeRateApiResponse.Response.Rates;
        return currMapRates;
    }
    
    public async Task<Dictionary<string, double>> GetHistoricalExchangeRates(string baseCurr)
    {
        var yesterday = DateTime.Today.AddDays(-1).ToString("yyyy-MM-dd",CultureInfo.CreateSpecificCulture("en-US"));
        var url = "https://api.currencybeacon.com/v1/historical?api_key=" + _currencyBeaconApiKey + "&base=" + baseCurr + "&date=" + yesterday;
        var currMapRatesResponse = await _httpClient.GetFromJsonAsync<CurrencyBeaconExchangeRateApiResponse>(url);
        var currMapRates = currMapRatesResponse.Response.Rates;
        return currMapRates;
    }

    public async Task<Dictionary<string, CurrCountriesResponse>> GetCurrCountries()
    {
        string url = "https://api.currencybeacon.com/v1/currencies?api_key=" + _currencyBeaconApiKey;
        var currCountriesResponse = await _httpClient.GetFromJsonAsync<CurrencyBeaconCurrCountriesApiResponse>(url);
        Dictionary<string, CurrCountriesResponse> currCountries =  TransformedCurrCountriesResData(currCountriesResponse);
        return currCountries;
    }

    public async Task<SortedList<string, double>> GetExchangeRatesTimeSeries(string baseCurr, string targetCurr,
        string timeSeriesRange)
    {
        var endDate = DateTime.Now.ToString("yyyy-MM-dd");
        var startDate = GetStartingDate(timeSeriesRange);
        var url = "https://api.currencybeacon.com/v1/timeseries?api_key=" + _currencyBeaconApiKey + "&start_date=" +
                  startDate + "&end_date=" + endDate + "&base=" + baseCurr + "&symbols=" + targetCurr;
        var rateTimeSeriesApiResponse = await _httpClient.GetFromJsonAsync<CurrencyBeaconTimeSeriesApiResponse>(url);
        var sortedRateTimeSeries = TransformedTimeSeriesResData(rateTimeSeriesApiResponse, targetCurr);
        return sortedRateTimeSeries;
    }

    private string GetStartingDate(string timeSeriesRange)
    {
        DateTime offsetToday = default;
        DateTime today = DateTime.Today;
        if (timeSeriesRange.ToLower().Equals("week"))
            offsetToday = today.AddDays(-6);
        else if (timeSeriesRange.ToLower().Equals("month"))
            offsetToday = today.AddMonths(-1);
        else if (timeSeriesRange.ToLower().Equals("quater"))
            offsetToday = today.AddMonths(-3);
        else if (timeSeriesRange.ToLower().Equals("half year"))
            offsetToday = today.AddMonths(-6);

        var startDate = offsetToday.ToString("yyyy-MM-dd", CultureInfo.CreateSpecificCulture("en-US"));
        return startDate;
    }

    private Dictionary<string, CurrCountriesResponse> TransformedCurrCountriesResData(
        CurrencyBeaconCurrCountriesApiResponse currCountriesRes)
    {
        CurrencyBeaconCurrCountriesApiResponseResponse[] data = currCountriesRes.Response;
        Dictionary<string, CurrCountriesResponse> currCountries = new Dictionary<string, CurrCountriesResponse>();
        if (data != null)
            for (int i = 0; i < data.Length; i++)
            {
                CurrencyBeaconCurrCountriesApiResponseResponse currCountryDetail = data[i];
                string key = currCountryDetail.CurrCode;
                string currCode = key;
                string countryCurrName = currCountryDetail.CurrNameWithCountryName;
                string display = currCode + " - " + countryCurrName;
                string currSymbol = currCountryDetail.CurrSymbol;
                string flagCode = currCode.Substring(0, 2);
                CurrCountriesResponse val = new CurrCountriesResponse(currCode, countryCurrName, display, currSymbol, flagCode);
                currCountries[key] = val;
            }

        return currCountries;
    }

    private SortedList<string, double> TransformedTimeSeriesResData(
        CurrencyBeaconTimeSeriesApiResponse rateTimeSeriesApiResponse, string targetCurr)
    {
        var dateByRateLists = rateTimeSeriesApiResponse.Response;
        Dictionary<string, double> unsortedList = new Dictionary<string, double>();

        foreach (var dateByRateList in dateByRateLists)
        {
            var date = dateByRateList.Key;
            var rate = dateByRateList.Value[targetCurr];
            unsortedList.Add(date, rate);
        }

        SortedList<string, double> sortedList = new SortedList<string, double>(unsortedList);
        return sortedList;
    }
}