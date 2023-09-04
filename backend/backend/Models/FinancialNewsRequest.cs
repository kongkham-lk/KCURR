using System.Text.Json.Serialization;

namespace backend.Models;

public class FinancialNewsRequest
{
    [JsonPropertyName("newsTopic")]
    public string NewsTopic { set; get; }
}