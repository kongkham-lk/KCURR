using System.Globalization;

namespace backend.Utilities;

public class DateGetter
{
    string[] dateRanges = { "1d", "1w", "1m", "3m", "6m", "9m", "1y" };

    public DateGetter()
    {
    }

    public string[] GetDateRange()
    {
        return dateRanges;
    }

    public static string GetTodayOffsetDateInString(string timeSeriesRange, IWebHostEnvironment env)
    {
        DateTime offsetToday = OffsetDateFromToday(timeSeriesRange, env);
        var startDate = offsetToday.ToString("yyyy-MM-dd", CultureInfo.CreateSpecificCulture("en-US"));
        return startDate;
    }

    public static DateTime OffsetDateFromToday(string timeSeriesRange, IWebHostEnvironment env)
    {
        DateTime offsetToday = default;
        DateTime today = env == null ? DateTime.Today : Convert.ToDateTime("2024-06-11", new CultureInfo("en-US"));
        switch (timeSeriesRange.ToLower())
        {
            case "1d":
                offsetToday = today.AddDays(-1);
                break;
            case "1w":
                offsetToday = today.AddDays(-6);
                break;
            case "1m":
                offsetToday = today.AddMonths(-1);
                break;
            case "3m":
                offsetToday = today.AddMonths(-3);
                break;
            case "6m":
                offsetToday = today.AddMonths(-6);
                break;
            case "9m":
                offsetToday = today.AddMonths(-9);
                break;
            case "1y":
                offsetToday = today.AddYears(-1).AddDays(1); // Don't get the today's last year
                break;
        }
        return offsetToday;
    }

    //public static Dictionary<string, DateTime> GetDateRangeByOffsetDateList()
    //{
    //    Dictionary<string, DateTime> dateRangeByOffsetDateList = new();
    //    string[] dateRanges = new DateGetter().GetDateRange();

    //    foreach(var dateRange in dateRanges)
    //    {
    //        DateTime tempDateOffset = DateGetter.OffsetDateFromToday(dateRange);
    //        dateRangeByOffsetDateList.Add(dateRange, tempDateOffset);
    //    }
    //    return dateRangeByOffsetDateList;
    //}
}

