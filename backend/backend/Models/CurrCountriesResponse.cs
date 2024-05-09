using System.Text.Json.Serialization;

namespace backend.Models;

public class CurrCountriesResponse
{
    [JsonPropertyName("currCode")]
    public string CurrCode { set; get; }
    [JsonPropertyName("countryName")]
    public string CountryName { set; get; }
    [JsonPropertyName("display")]
    public string Display { set; get; }
    [JsonPropertyName("currSymbol")]
    public string CurrSymbol { set; get; }
    [JsonPropertyName("flagCode")]
    public string FlagCode { set; get; }

    public CurrCountriesResponse(string currCode, string countryName, string display, string currSymbol,
        string flagCode)
    {
        this.CurrCode = currCode;
        this.CountryName = countryName;
        this.Display = display;
        this.CurrSymbol = currSymbol;
        this.FlagCode = flagCode;
    }
}