using System.Text.Json.Serialization;
using backend.ApiClients.RapidApi;

namespace backend.Models;

public class FinancialNewsResponse
{
    [JsonPropertyName("title")]
    public string Title {set; get;}
    [JsonPropertyName("link")]
    public string Link {set; get;}
    [JsonPropertyName("publisher")]
    public string Publisher {set; get;}
    [JsonPropertyName("publishTime")]
    public string PublishTime {set; get;}
    [JsonPropertyName("thumbnail")]
    public string Thumbnail {set; get;}


    public FinancialNewsResponse(string title, string link, string publisher, string publishTime, string thumbnail)
    {
        Title = title;
        Link = link;
        Publisher = publisher;
        PublishTime = publishTime;
        Thumbnail = thumbnail;
    }
}