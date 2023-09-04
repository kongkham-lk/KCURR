using System.Text.Json.Serialization;

namespace backend.ApiClients.RapidApi;

public class RapidApiApiResponseNews
{
    [JsonPropertyName("title")]
    public string Title { set; get; }
    [JsonPropertyName("publisher")]
    public string Publisher { set; get; }
    [JsonPropertyName("link")]
    public string Link { set; get; }
    [JsonPropertyName("providerPublishTime")]
    public long PublishTime { set; get; }
    [JsonPropertyName("thumbnail")]
    public RapidApiApiResponseThumbnail Thumbnail { set; get; }
    
    public string GetThumbnail() {
        return Thumbnail.Resolutions[0].Url;
    }
}