using System.Globalization;
using backend.Interfaces;
using backend.Models;
using backend.Utilities;

namespace backend.ApiClients.CurrencyBeacon;

public class CurrencyBeaconApiClient : IExchangeRateApiClient
{
    private readonly HttpClient _httpClient;
    private readonly ApiKeysProvider _apiKeysProvider;
    private string _currencyBeaconApiKey;
    private readonly ILogger<CurrencyBeaconApiClient> _logger;
    private readonly bool isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

    public CurrencyBeaconApiClient(HttpClient httpClient, ApiKeysProvider apiKeysProvider, ILogger<CurrencyBeaconApiClient> logger)
    {
        _httpClient = httpClient;
        _apiKeysProvider = apiKeysProvider;
        _currencyBeaconApiKey = _apiKeysProvider.GetApiKey(ApiKeysProvider.ApiName.CurrencyBeaconApiKey);
        _logger = logger;
    }

    public async Task<Dictionary<string, double>> GetLatestExchangeRates(string baseCurr)
    {
        CurrencyBeaconExchangeRateApiResponse exchangeRateApiResponse;
        if (isDevelopment)
        {
            string relativePath = "/Latest-USD.json";
            exchangeRateApiResponse = await JsonSeedFilesReader.ReadCurrFromJson<CurrencyBeaconExchangeRateApiResponse>(relativePath);
        }
        else
        {
            var url = "https://api.currencybeacon.com/v1/latest?api_key=" + _currencyBeaconApiKey + "&base=" + baseCurr;
            exchangeRateApiResponse = await _httpClient.GetFromJsonAsync<CurrencyBeaconExchangeRateApiResponse>(url);
        }
        var currMapRates = exchangeRateApiResponse.Response.Rates;
        return currMapRates;
    }
    
    public async Task<Dictionary<string, double>> GetHistoricalExchangeRates(string baseCurr)
    {
        CurrencyBeaconExchangeRateApiResponse currMapRatesResponse;
        if (isDevelopment)
        {
            string relativePath = "/Historical-USD.json";
            currMapRatesResponse = await JsonSeedFilesReader.ReadCurrFromJson<CurrencyBeaconExchangeRateApiResponse>(relativePath);
        }
        else
        {
            var yesterday = DateTime.Today.AddDays(-1).ToString("yyyy-MM-dd", CultureInfo.CreateSpecificCulture("en-US"));
            var url = "https://api.currencybeacon.com/v1/historical?api_key=" + _currencyBeaconApiKey + "&base=" + baseCurr + "&date=" + yesterday;
            currMapRatesResponse = await _httpClient.GetFromJsonAsync<CurrencyBeaconExchangeRateApiResponse>(url);
        }
        var currMapRates = currMapRatesResponse.Response.Rates;
        return currMapRates;
    }

    public async Task<Dictionary<string, CurrCountriesResponse>> GetCurrCountries(bool getAnotherApiKey)
    {
        CurrencyBeaconCurrCountriesApiResponse currCountriesResponse;
        if (isDevelopment)
        {
            string relativePath = "/Currencies-Countries.json";
            currCountriesResponse = await JsonSeedFilesReader.ReadCurrFromJson<CurrencyBeaconCurrCountriesApiResponse>(relativePath);
        }
        else
        {
            if (getAnotherApiKey)
                _currencyBeaconApiKey = _apiKeysProvider.GetApiKey(ApiKeysProvider.ApiName.CurrencyBeaconApiKey);

            string url = "https://api.currencybeacon.com/v1/currencies?api_key=" + _currencyBeaconApiKey;
            currCountriesResponse = await _httpClient.GetFromJsonAsync<CurrencyBeaconCurrCountriesApiResponse>(url);
        }
        Dictionary<string, CurrCountriesResponse> currCountries = TransformedCurrCountriesResData(currCountriesResponse);
        return currCountries;
    }

    public async Task<SortedList<string, double>> GetExchangeRatesTimeSeries(string baseCurr, string targetCurr,
        string timeSeriesRange)
    {
        CurrencyBeaconTimeSeriesApiResponse rateTimeSeriesApiResponse;
        if (isDevelopment)
        {
            string relativePath = "/Timeseries-USD_THB-" + timeSeriesRange + ".json";
            rateTimeSeriesApiResponse = await JsonSeedFilesReader.ReadCurrFromJson<CurrencyBeaconTimeSeriesApiResponse>(relativePath);
            targetCurr = "THB"; // the seeding file only provide rate sample of USD-THB
        }
        else
        {
            var endDate = DateTime.Now.ToString("yyyy-MM-dd");
            var startDate = GetStartingDate(timeSeriesRange);
            var url = "https://api.currencybeacon.com/v1/timeser ies?api_key=" + _currencyBeaconApiKey + "&start_date=" +
                      startDate + "&end_date=" + endDate + "&base=" + baseCurr + "&symbols=" + targetCurr;
            rateTimeSeriesApiResponse = await _httpClient.GetFromJsonAsync<CurrencyBeaconTimeSeriesApiResponse>(url);
        }
        var sortedRateTimeSeries = TransformedTimeSeriesResData(rateTimeSeriesApiResponse, targetCurr);
        return sortedRateTimeSeries;
    }

    private string GetStartingDate(string timeSeriesRange)
    {
        DateTime offsetToday = default;
        DateTime today = DateTime.Today;
        if (timeSeriesRange.ToLower().Equals("1d"))
            offsetToday = today.AddDays(-1);
        else if (timeSeriesRange.ToLower().Equals("1w"))
            offsetToday = today.AddDays(-6);
        else if (timeSeriesRange.ToLower().Equals("1m"))
            offsetToday = today.AddMonths(-1);
        else if (timeSeriesRange.ToLower().Equals("3m"))
            offsetToday = today.AddMonths(-3);
        else if (timeSeriesRange.ToLower().Equals("6m"))
            offsetToday = today.AddMonths(-6);
        else if (timeSeriesRange.ToLower().Equals("1y"))
            offsetToday = today.AddYears(-1);

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