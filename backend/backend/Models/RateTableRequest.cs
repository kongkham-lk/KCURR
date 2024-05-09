using System.Text.Json.Serialization;

namespace backend.Models;

public class RateTableRequest
{
    [JsonPropertyName("baseCurr")]
    public string BaseCurr { set; get; }
}