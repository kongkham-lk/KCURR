using System.Text.Json.Serialization;

namespace backend.ApiClients.CurrencyBeacon;

public class CurrencyBeaconCurrCountriesApiResponseResponse
{
    [JsonPropertyName("name")]
    public string CurrNameWithCountryName { get; set; }

    [JsonPropertyName("short_code")]
    public string CurrCode { get; set; }

    [JsonPropertyName("symbol")]
    public string CurrSymbol { get; set; }
}