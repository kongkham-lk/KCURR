using System.Text.Json.Serialization;

namespace backend.ApiClients.CurrencyBeacon;

public class CurrencyBeaconTimeSeriesApiResponse
{
    [JsonPropertyName("response")]
    public Dictionary<string, Dictionary<string, double>> Response { set; get; }
}