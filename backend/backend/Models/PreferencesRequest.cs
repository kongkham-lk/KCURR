using System;
using System.Text.Json.Serialization;

namespace backend.Models;

public class Preferences
{
    [JsonPropertyName("theme")]
    public string Theme { set; get; }
    [JsonPropertyName("liveRateCurrCodes")]
    public List<string> LiveRateCurrCodes { set; get; }
    [JsonPropertyName("newsCategories")]
    public List<string> NewsCategories { set; get; }
    [JsonPropertyName("convertedCurrPair")]
    public string[] ConvertedCurrPair { set; get; }
}

