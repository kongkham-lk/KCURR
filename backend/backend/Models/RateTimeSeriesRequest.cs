using System.Text.Json.Serialization;

namespace backend.Models;

public class RateTimeSeriesRequest
{
    [JsonPropertyName("baseCurr")]
    public string BaseCurr { set; get; }
    [JsonPropertyName("targetCurr")]
    public string TargetCurr { set; get; }
    [JsonPropertyName("timeSeriesRange")]
    public string TimeSeriesRange { set; get; }
    [JsonPropertyName("isNewUpdateRequest")]
    public bool IsNewUpdateRequest { set; get; }
}