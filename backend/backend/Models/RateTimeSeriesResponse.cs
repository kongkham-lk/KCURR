using System.Text.Json.Serialization;

namespace backend.Models;

public class RateTimeSeriesResponse
{
    [JsonPropertyName("dayRangeIndicator")]
    public string[] DayRangeIndicator { set; get; }
    [JsonPropertyName("monthRangeIndicator")]
    public string[] MonthRangeIndicator { set; get; }
    [JsonPropertyName("changingRates")]
    public double[] ChangingRates { set; get; }
    [JsonPropertyName("highest")]
    public double Highest { set; get; }
    [JsonPropertyName("lowest")]
    public double Lowest { set; get; }
    [JsonPropertyName("latestRate")]
    public double LatestRate { set; get; }

    public RateTimeSeriesResponse(string[] dayRangeIndicator, string[] monthRangeIndicator, double[] changingRates,
        double highest, double lowest, double latestRate)
    {
        DayRangeIndicator = dayRangeIndicator;
        MonthRangeIndicator = monthRangeIndicator;
        ChangingRates = changingRates;
        Highest = highest;
        Lowest = lowest;
        Lowest = lowest;
        LatestRate = latestRate;
    }
}