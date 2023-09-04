using System.Text.Json.Serialization;

namespace backend.ApiClients.RapidApi;

public class RapidApiApiResponse
{
    [JsonPropertyName("news")]
    public RapidApiApiResponseNews[] News { set; get; }
}