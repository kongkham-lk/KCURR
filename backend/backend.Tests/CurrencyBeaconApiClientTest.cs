using backend;
using Xunit;
using backend.ApiClients.CurrencyBeacon;
using backend.Models;

namespace backend.Tests;

public class CurrencyBeaconApiClientTest
{
    private CurrencyBeaconApiClient _test = new CurrencyBeaconApiClient();
    
    [Theory]
    [InlineData(new string[]{"Canadian Dollar", "Thai Baht", "Lao Kip"}, new string[]{"CAD", "THB", "KIP"}, new string[]{"C", "T", "K"})]
    [InlineData(new string[]{"Canadian Dollar", "Thai Baht", "Lao Kip"}, new string[]{"", "THB", "KIP"}, new string[]{"C", "T", "K"})]
    public void TransformedCurrCountriesResData_ValidValuePassed(
        string[] currName, string[] currCode, string[] currSymbol)
    {
        CurrencyBeaconCurrCountriesApiResponseResponse[] testRes = new CurrencyBeaconCurrCountriesApiResponseResponse[currName.Length];
        for (int i = 0; i < currName.Length; i++)
        {
            testRes[i] = new CurrencyBeaconCurrCountriesApiResponseResponse();
            testRes[i].CurrNameWithCountryName = currName[i];
            testRes[i].CurrCode = currCode[i];
            testRes[i].CurrSymbol = currSymbol[i];
        }
        
        //Arrange
        CurrCountriesResponse exact;
        string tempCode = testRes[0].CurrCode;
        string countryCurrName = testRes[0].CurrNameWithCountryName;
        string display = tempCode + " - " + countryCurrName;
        string tempSymbol = testRes[0].CurrSymbol;
        exact = new CurrCountriesResponse(tempCode, countryCurrName, display, tempSymbol, "flagcode");
        
        //Act
        Dictionary<string, CurrCountriesResponse> actual = _test.TransformedCurrCountriesResData(testRes);

        Assert.True(actual.Count == testRes.Length);
        Assert.True(actual.ContainsKey(exact.CurrCode));
        Assert.Equal(exact.CurrSymbol, actual[exact.CurrCode].CurrSymbol);
        Assert.Equal(exact.CountryName, actual[exact.CurrCode].CountryName);
        Assert.Equal(exact.Display, actual[exact.CurrCode].Display);
    }
    
    [Fact]
    public void TransformedCurrCountriesResData_NullValuePassed()
    {
        CurrencyBeaconCurrCountriesApiResponseResponse[] testRes = new CurrencyBeaconCurrCountriesApiResponseResponse[0];
        
        Assert.Throws<ArgumentException>("Curr Countries Response", () => _test.TransformedCurrCountriesResData(null));
        Assert.Throws<ArgumentException>("Curr Countries Response", () => _test.TransformedCurrCountriesResData(testRes));
    }
    
    [Theory]
    [InlineData(new string[]{"2024-06-10", "2024-06-11"}, new string[]{"THB", "THB"}, new double[]{36.76282392, 36.73527387}, "THB")]
    [InlineData(
        new string[]{"2024-03-11", "2024-03-12", "2024-03-13", "2024-03-14", "2024-03-15", "2024-03-16", "2024-03-17"}, 
        new string[]{"THB", "THB", "THB", "THB", "THB", "THB", "THB"}, 
        new double[]{35.50276647, 35.69639875, 35.69128391,35.81680726, 35.82910611, 35.87319121, 35.95143979 }, 
        "THB"
        )]
    public void TransformedTimeSeriesResToDictionary_ValidValuePassed(
        string[] dayDates, string[] currCodes, double[] rates, string targetCurr)
    {
        SortedList<string, double> expected = new SortedList<string, double>();
        CurrencyBeaconTimeSeriesApiResponse[] testRes = new CurrencyBeaconTimeSeriesApiResponse[dayDates.Length];
        
        for (int i = 0; i < dayDates.Length; i++)
        {
            // Arrange
            expected.Add(dayDates[i], rates[i]);
            
            // Act
            Dictionary<string, double> currByRate = new Dictionary<string, double>();
            currByRate.Add(currCodes[i], rates[i]);
            Dictionary<string, Dictionary<string, double>> dayByCurr = new();
            dayByCurr.Add(dayDates[i], currByRate);
            
            testRes[i] = new CurrencyBeaconTimeSeriesApiResponse();
            testRes[i].Response = dayByCurr;
        }

        SortedList<string, double> actual = _test.TransformedTimeSeriesResToDictionary(testRes, targetCurr);
        
        Assert.True(expected.SequenceEqual(actual));
    }
    
    [Theory]
    [InlineData(new string[]{"2024-06-10", "2024-06-11"}, new string[]{"THB", "THB"}, new double[]{36.76282392, 36.73527387}, "THB")]
    public void TransformedTimeSeriesResToDictionary_NullValuePassed(
        string[] dayDates, string[] currCodes, double[] rates, string targetCurr)
    {
        SortedList<string, double> expected = new SortedList<string, double>();
        CurrencyBeaconTimeSeriesApiResponse[] testRes = new CurrencyBeaconTimeSeriesApiResponse[dayDates.Length];
        
        for (int i = 0; i < dayDates.Length; i++)
        {
            // Arrange
            expected.Add(dayDates[i], rates[i]);
            
            // Act
            Dictionary<string, double> currByRate = new Dictionary<string, double>();
            currByRate.Add(currCodes[i], rates[i]);
            Dictionary<string, Dictionary<string, double>> dayByCurr = new();
            dayByCurr.Add(dayDates[i], currByRate);
            
            testRes[i] = new CurrencyBeaconTimeSeriesApiResponse();
            testRes[i].Response = dayByCurr;
        }
        
        Assert.Throws<ArgumentNullException>("Target Curr", () => _test.TransformedTimeSeriesResToDictionary(testRes, ""));
        Assert.Throws<ArgumentNullException>("Target Curr", () => _test.TransformedTimeSeriesResToDictionary(testRes, null));
        Assert.Throws<ArgumentNullException>("Time Series Response's Response", () => _test.TransformedTimeSeriesResToDictionary(new CurrencyBeaconTimeSeriesApiResponse[dayDates.Length] , targetCurr));
        Assert.Throws<ArgumentNullException>("Time Series Responses", () => _test.TransformedTimeSeriesResToDictionary(null , targetCurr));
    }
}