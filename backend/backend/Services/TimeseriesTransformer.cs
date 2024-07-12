using System.Globalization;
using backend.Interfaces;
using backend.Models;
using backend.Utilities;

namespace backend.Services;

public class TimeseriesTransformer
{
    private readonly IEnumerable<IExchangeRateApiClient> _exchangeRateApiClients;
    private readonly IWebHostEnvironment _env;

    public TimeseriesTransformer(IEnumerable<IExchangeRateApiClient> exchangeRateApiClients, IWebHostEnvironment env)
    {
        _env = env;
        _exchangeRateApiClients = exchangeRateApiClients.ToList();
    }
    
    public Dictionary<string, RateTimeSeriesResponse> TransformedData (SortedList<string, double> timeSeries, string targetCurr, string targetDateRange)
    {
        Dictionary<string, RateTimeSeriesResponse> targetCurrTimeSeries = new Dictionary<string, RateTimeSeriesResponse>();
        string targetOffsetDate = DateGetter.OffsetDateFromToday(targetDateRange, _env).ToString("yyyy-MM-dd");
        int range = timeSeries.Count() - timeSeries.IndexOfKey(targetOffsetDate); // total size (the last day key) - the offset date key
        string[] dayRange = new string[range];
        string[] monthRange = new string[range];
        double[] changingRates = new double[range];
        int index = range - 1;

        try
        {
            for (int i = timeSeries.Count() - 1; i >= timeSeries.IndexOfKey(targetOffsetDate); i--)
            {
                string fullDate = timeSeries.Keys[i]; // return yyyy-MM-dd
                string year = fullDate.Substring(0, 4); // get yyyy
                int monthNum = int.Parse(fullDate.Substring(5, 2)); // get MM
                string monthAbbr = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(monthNum); // get the abbr. of the month
                string day = fullDate.Substring(fullDate.Length - 2); // get dd
                dayRange[index] = day + " " + monthAbbr;
                monthRange[index] = monthAbbr + " " + year;
                double rate = timeSeries.Values[i]; // return rate
                changingRates[index] = rate;
                index--;
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }
        
        double highest = changingRates.Max();
        double lowest = changingRates.Min();
        
        RateTimeSeriesResponse timeSeriesDetail = new RateTimeSeriesResponse(dayRange, monthRange, changingRates, highest, lowest);
        targetCurrTimeSeries.Add(targetCurr, timeSeriesDetail);
        return targetCurrTimeSeries;
    }
}