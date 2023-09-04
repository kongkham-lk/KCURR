using System.Globalization;
using backend.Interfaces;
using backend.Models;

namespace backend.ApiClients.RapidApi;

public class RapidApiApiClient : IFinancialNewsApiClient
{
    private readonly HttpClient _httpClient;
    private readonly string _rapidApiApiKey;

    public RapidApiApiClient(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        ApiKeysProvider apiKeysProvider = new ApiKeysProvider();
        _rapidApiApiKey = apiKeysProvider.GetApiKey(ApiKeysProvider.ApiName.RapidApiApiKey);
        _httpClient.BaseAddress = new Uri("https://apidojo-yahoo-finance-v1.p.rapidapi.com");
        _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", _rapidApiApiKey);
        _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Host", "apidojo-yahoo-finance-v1.p.rapidapi.com");
    }
    
    public async Task<FinancialNewsResponse[]> GetFinancialNews(string newsTopic)
    {
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
            var newsPublishTime = FormatTimeStructure(news.PublishTime);
            string newsThumbnail;
            try {
                newsThumbnail = news.GetThumbnail();
            } catch (Exception e) {
                newsThumbnail = null!;
            }

            newsLists[i] = new FinancialNewsResponse(newsTitle, newsLink, newsPublisher, newsPublishTime, newsThumbnail);
        }
        return newsLists;
    }
    
    private string FormatTimeStructure(long newsPublishTimeRes) {
        var unixTimestamp = DateTimeOffset.FromUnixTimeSeconds(newsPublishTimeRes).ToLocalTime();
        var formattedDate = unixTimestamp.ToString("ddd, MMM dd, yyyy hh:mm:ss tt", CultureInfo.InvariantCulture);
        formattedDate = formattedDate.Insert(formattedDate.Length - 12, " at");

        return formattedDate;
    }
}