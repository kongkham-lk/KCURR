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
    private readonly IWebHostEnvironment _env;
    private readonly bool isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

    public CurrencyBeaconApiClient(HttpClient httpClient, ApiKeysProvider apiKeysProvider, ILogger<CurrencyBeaconApiClient> logger, IWebHostEnvironment env)
    {
        _httpClient = httpClient;
        _apiKeysProvider = apiKeysProvider;
        _currencyBeaconApiKey = _apiKeysProvider.GetApiKey(ApiKeysProvider.ApiName.CurrencyBeaconApiKey);
        _logger = logger;
        _env = env;
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

    public async Task<SortedList<string, double>> GetExchangeRatesTimeSeries(string baseCurr, string targetCurr, string timeSeriesRange)
    {
        _logger.LogInformation($"Requesting for new TimeSeries object of: {baseCurr} to {targetCurr}");
        CurrencyBeaconTimeSeriesApiResponse[] rateTimeSeriesApiResponseList = new CurrencyBeaconTimeSeriesApiResponse[2];
        string[] pathToJSON = new string[2];
        if (isDevelopment)
        {
            pathToJSON[0] = "/Timeseries-USD_THB-6m_a.json";
            pathToJSON[1] = "/Timeseries-USD_THB-6m_b.json";
            rateTimeSeriesApiResponseList[0] = await JsonSeedFilesReader.ReadCurrFromJson<CurrencyBeaconTimeSeriesApiResponse>(pathToJSON[0]);
            rateTimeSeriesApiResponseList[1] = await JsonSeedFilesReader.ReadCurrFromJson<CurrencyBeaconTimeSeriesApiResponse>(pathToJSON[1]);
            targetCurr = "GBP"; // the seeding file only provide rate sample of USD-THB
        }
        else
        {
            string[] startDate = new string[2];
            string[] endDate = new string[2];
            IWebHostEnvironment? tempEnv = _env.IsDevelopment() ? _env : null;
            endDate[1] = DateTime.Now.ToString("yyyy-MM-dd");
            startDate[1] = DateGetter.GetTodayOffsetDateInString("6m", tempEnv, true); // get last 6-month's 1 day after today
            endDate[0] = DateGetter.GetTodayOffsetDateInString("6m", tempEnv);
            startDate[0] = DateGetter.GetTodayOffsetDateInString("1y", tempEnv); // get last year's 1 day after today
            pathToJSON[0] = "https://api.currencybeacon.com/v1/timeseries?api_key=" + _currencyBeaconApiKey + "&start_date=" +
                      startDate[0] + "&end_date=" + endDate[0] + "&base=" + baseCurr + "&symbols=" + targetCurr;
            pathToJSON[1] = "https://api.currencybeacon.com/v1/timeseries?api_key=" + _currencyBeaconApiKey + "&start_date=" +
                      startDate[1] + "&end_date=" + endDate[1] + "&base=" + baseCurr + "&symbols=" + targetCurr;
            rateTimeSeriesApiResponseList[0] = await _httpClient.GetFromJsonAsync<CurrencyBeaconTimeSeriesApiResponse>(pathToJSON[0]);
            rateTimeSeriesApiResponseList[1] = await _httpClient.GetFromJsonAsync<CurrencyBeaconTimeSeriesApiResponse>(pathToJSON[1]);

        }
        var DateByTimeSeriesDetail = TransformedTimeSeriesResToDictionary(rateTimeSeriesApiResponseList, targetCurr);
        return DateByTimeSeriesDetail;
    }

    private Dictionary<string, CurrCountriesResponse> TransformedCurrCountriesResData(CurrencyBeaconCurrCountriesApiResponse currCountriesRes)
    {
        CurrencyBeaconCurrCountriesApiResponseResponse[] data = currCountriesRes.Response;
        Dictionary<string, CurrCountriesResponse> currCountries = new Dictionary<string, CurrCountriesResponse>();

        if (data != null)
        {
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
        }

        return currCountries;
    }

    private SortedList<string, double> TransformedTimeSeriesResToDictionary(CurrencyBeaconTimeSeriesApiResponse[] rateTimeSeriesApiResponses, string targetCurr)
    {
        Dictionary<string, double> unsortedList = new Dictionary<string, double>();

        foreach (var rateTimeSeriesApiResponse in rateTimeSeriesApiResponses)
        {
            var dateByRateLists = rateTimeSeriesApiResponse.Response;
            foreach (var dateByRateList in dateByRateLists)
            {
                var date = dateByRateList.Key;
                var rate = dateByRateList.Value[targetCurr];
                unsortedList.Add(date, rate);
            }
        }

        SortedList<string, double> sortedList = new SortedList<string, double>(unsortedList);
        return sortedList;
    }
}