using System.Text.Json.Serialization;

namespace backend.ApiClients.CurrencyBeacon;

public class CurrencyBeaconCurrCountriesApiResponse
{
    [JsonPropertyName("response")]
    public CurrencyBeaconCurrCountriesApiResponseResponse[] Response { set; get; }
}