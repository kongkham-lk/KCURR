using backend.Models;
using backend.Services;
using Xunit;

namespace backend.Tests.ServicesTest;

public class CurrServiceTest
{
    private CurrService _test = new CurrService();

    // private async Task<Dictionary<string,RateTimeSeriesResponse>> InitializedData()
    // {
    //     return await _test.FetchNewTimeSeriesUpdate("CAD", "USD", "1d");
    // }

    [Fact]
    private void UpdateMemoRangeByCurrTimeSeriesLists_NullValuePassed()
    {
        Assert.Throws<ArgumentException>("Time range response",
            () => _test.UpdateMemoRangeByCurrTimeSeriesLists("", null));
    }

    [Fact]
    private void FetchExistedTimeSeries_RequestNewUpdate()
    {
        Assert.True(_test.FetchExistedTimeSeries("", "", true) is null);
    }

    [Theory]
    [InlineData("CAD", "USD", "1d", false)]
    private void FetchExistedTimeSeries_RequestUnSaveExistingValue(string baseCurr, string targetCurr,string timeSeriesRange,
        bool isNewUpdateRequest)
    {
        Assert.True(_test.FetchExistedTimeSeries(timeSeriesRange, targetCurr, isNewUpdateRequest) is null); // because no key found
    }

    // // CANT RUN THIS TEST -> FAIL TO INITIALIZED DATA
    // [Theory]
    // [InlineData("CAD", "", "1d", false)]
    // [InlineData("CAD", "USD", "", false)]
    // [InlineData("CAD", "", "", false)]
    // private async Task FetchExistedTimeSeries_ValidValuePassed(string baseCurr, string targetCurr,string timeSeriesRange,
    //     bool isNewUpdateRequest)
    // {
    //     Dictionary<string,RateTimeSeriesResponse> actual = await InitializedData();
    //     Assert.True(_test.FetchExistedTimeSeries(timeSeriesRange, targetCurr, isNewUpdateRequest).SequenceEqual(actual));
    // }
}