using System.Text.Json.Serialization;

namespace backend.ApiClients.RapidApi;

public class RapidApiApiResponseThumbnail
{
    [JsonPropertyName("resolutions")]
    public RapidApiApiResponseResolutions[] Resolutions { set; get; }
}