using System.Text.Json.Serialization;

namespace backend.ApiClients.RapidApi;

public class RapidApiApiResponseResolutions
{
    [JsonPropertyName("url")]
    public string Url { set; get; }
}