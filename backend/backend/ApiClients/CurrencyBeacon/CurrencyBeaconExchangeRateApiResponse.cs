using System.Text.Json.Serialization;

namespace backend.ApiClients.CurrencyBeacon;

public class CurrencyBeaconExchangeRateApiResponse
{
    [JsonPropertyName("response")]
    public CurrencyBeaconExchangeRateApiResponseResponse Response { set; get; }
}