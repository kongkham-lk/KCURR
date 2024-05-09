using System.Globalization;
using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class TimeseriesTransformer
{
    private readonly IEnumerable<IExchangeRateApiClient> _exchangeRateApiClients;

    public TimeseriesTransformer(IEnumerable<IExchangeRateApiClient> exchangeRateApiClients)
    {
        _exchangeRateApiClients = exchangeRateApiClients.ToList();
    }
    
    public Dictionary<string, RateTimeSeriesResponse> TransformedData (SortedList<string, double> timeSeries, string targetCurr)
    {
        Dictionary<string, RateTimeSeriesResponse> targetCurrTimeSeries = new Dictionary<string, RateTimeSeriesResponse>();
        int range = timeSeries!.Count;
        string[] dayRange = new string[range];
        string[] monthRange = new string[range];
        double[] changingRates = new double[range];
        int i = 0;
        
        foreach (var element in timeSeries)
        {
            string fullDate = element.Key; // return yyyy-MM-dd
            string year = fullDate.Substring(0, 4); // get yyyy
            int monthNum = int.Parse(fullDate.Substring(5, 2)); // get MM
            string monthAbbr = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(monthNum); // get the abbr. of the month
            string day = fullDate.Substring(fullDate.Length - 2); // get dd
            dayRange[i] = day + " " + monthAbbr;
            monthRange[i] = monthAbbr + " " + year;
            double rate = element.Value; // return rate
            changingRates[i] = rate;
            i++;
        }
        
        double highest = changingRates.Max();
        double lowest = changingRates.Min();
        
        RateTimeSeriesResponse timeSeriesDetail = new RateTimeSeriesResponse(dayRange, monthRange, changingRates, highest, lowest);
        targetCurrTimeSeries.Add(targetCurr, timeSeriesDetail);
        return targetCurrTimeSeries;
    }
}