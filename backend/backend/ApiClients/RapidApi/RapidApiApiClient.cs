using System.Globalization;
using backend.Interfaces;
using backend.Models;

namespace backend.ApiClients.RapidApi;

public class RapidApiApiClient : IFinancialNewsApiClient
{
    private readonly HttpClient _httpClient;
    private readonly ApiKeysProvider _apiKeysProvider;
    private  string _rapidApiApiKey;

    public RapidApiApiClient(HttpClient httpClient, ApiKeysProvider apiKeysProvider)
    {
        _httpClient = httpClient;
        _apiKeysProvider = apiKeysProvider;
        _rapidApiApiKey = _apiKeysProvider.GetApiKey(ApiKeysProvider.ApiName.RapidApiApiKey);
        _httpClient.BaseAddress = new Uri("https://apidojo-yahoo-finance-v1.p.rapidapi.com");
        _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", _rapidApiApiKey);
        _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Host", "apidojo-yahoo-finance-v1.p.rapidapi.com");
    }
    
    public async Task<FinancialNewsResponse[]> GetFinancialNews(string newsTopic, bool getAnotherApiKey)
    {
        if (getAnotherApiKey)
            UpdateApiKey();

        string url = "/auto-complete?q=" + newsTopic + "&region=US";
        var financialNewsList = await RetrieveDataFromApi(url)!;
        return financialNewsList;
    }
    
    private async Task<FinancialNewsResponse[]> RetrieveDataFromApi(string url)
    {
        var response = await _httpClient.GetAsync(url);

        if (response.IsSuccessStatusCode)
        {
            var rapidApiResponse = await response.Content.ReadFromJsonAsync<RapidApiApiResponse>();
            return TransformJsonData(rapidApiResponse);
        }
        else
        {
            return null!;
        }
    }

    private FinancialNewsResponse[] TransformJsonData(RapidApiApiResponse rapidApiResponse)
    {
        var newsResLists = rapidApiResponse.News;
        var newsLists = new FinancialNewsResponse[newsResLists.Length];

        for (int i = 0; i < newsResLists.Length; i++)
        {
            RapidApiApiResponseNews news = newsResLists[i];
            string newsTitle = news.Title;
            string newsPublisher = news.Publisher;
            string newsLink = news.Link;
            DateTime newsPublishTime = GetActualDateTime(news.PublishTime);
            int diffTimeInHour = GetDiffTimeBetweenCurrentAndPublishTime(newsPublishTime);
            string formatePublishTime = FormatDateTime(newsPublishTime);
            string newsThumbnail;
            try {
                newsThumbnail = news.GetThumbnail();
            } catch (Exception e) {
                newsThumbnail = null!;
            }

            newsLists[i] = new FinancialNewsResponse(newsTitle, newsLink, newsPublisher, formatePublishTime, diffTimeInHour, newsThumbnail);
        }
        return newsLists;
    }

    private DateTime GetActualDateTime(long newsPublishTimeRes)
    {
        return DateTimeOffset.FromUnixTimeSeconds(newsPublishTimeRes).UtcDateTime;
    }

    private int GetDiffTimeBetweenCurrentAndPublishTime(DateTime publishTime)
    {
        DateTime utcNow = DateTime.UtcNow;
        return utcNow.Subtract(publishTime).Hours;
    }

    private string FormatDateTime(DateTime newsPublishTime)
    {
        return newsPublishTime.ToString("ddd, MMM dd, yyyy HH:mm", CultureInfo.InvariantCulture);
    }

    private void UpdateApiKey()
    {
        string newApiKey = _apiKeysProvider.GetApiKey(ApiKeysProvider.ApiName.RapidApiApiKey);

        if (_httpClient.DefaultRequestHeaders.Contains("X-RapidAPI-Key"))
        {
            _httpClient.DefaultRequestHeaders.Remove("X-RapidAPI-Key");
        }

        _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", newApiKey);
        _rapidApiApiKey = newApiKey;
    }
}