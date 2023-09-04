using System.Text.Json.Serialization;

namespace backend.ApiClients.CurrencyBeacon;

public class CurrencyBeaconExchangeRateApiResponseResponse
{
    [JsonPropertyName("date")]
    public string Date { set; get; }
    [JsonPropertyName("base")]
    public string Base { set; get; }
    [JsonPropertyName("rates")]
    public Dictionary<string, double> Rates { set; get; }
}