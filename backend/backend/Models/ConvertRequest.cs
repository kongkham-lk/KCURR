using System.Text.Json.Serialization;

namespace backend.Models;

public class ConvertRequest
{
    [JsonPropertyName("amount")]
    public double Amount { set; get; }
    [JsonPropertyName("baseCurr")]
    public string BaseCurr { set; get; }
    [JsonPropertyName("targetCurr")]
    public string TargetCurr { set; get; }
}