using System;
using System.Text.Json.Serialization;

namespace backend.Models;

public class Preferences
{
    [JsonPropertyName("theme")]
    public string Theme { set; get; }
    [JsonPropertyName("currencyCountries")]
    public List<string> CurrencyCountries { set; get; }
    [JsonPropertyName("newsCategoryies")]
    public List<string> NewsCategories { set; get; }
}

