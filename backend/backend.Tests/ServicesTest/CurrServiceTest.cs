using backend.Models;
using backend.Services;
using Xunit;

namespace backend.Tests.ServicesTest;

public class CurrServiceTest
{
    private CurrService _test = new CurrService();

    [Fact]
    private async Task UpdateMemoRangeByCurrTimeSeriesLists_NullValuePassed()
    {
        Assert.Throws<ArgumentException>("Time range response",
            () => _test.UpdateMemoRangeByCurrTimeSeriesLists("", null));
    }

    [Fact]
    private void FetchExistedTimeSeries_RequestNewUpdate()
    {
        Assert.True(_test.FetchExistedTimeSeries("", "", true) is null);
    }

    // [Theory]
    // [InlineData("1d", "CAD", false)]
    // private void FetchExistedTimeSeries_ValidValuePassed(string timeSeriesRange, string targetCurr,
    //     bool isNewUpdateRequest)
    // {
    //     
    // }
    //
    // [Theory]
    // [InlineData("1d", "", false)]
    // [InlineData("", "CAD", false)]
    // [InlineData("", "", false)]
    // private void FetchExistedTimeSeries_InValidValuePassed(string timeSeriesRange, string targetCurr,
    //     bool isNewUpdateRequest)
    // {
    //     
    // }
}