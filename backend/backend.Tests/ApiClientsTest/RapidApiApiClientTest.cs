using backend.ApiClients.RapidApi;
using backend.Models;
using Xunit;

namespace backend.Tests.ApiClientsTest;

public class RapidApiApiClientTest
{
    private RapidApiApiClient _test = new RapidApiApiClient(null, null);
    
    [Theory]
    [InlineData("news header", "publisher", "www.google.com", 1718471554, "www.google.com")]
    public void TransformJsonData_ValidValuePassed(string newsTitle, string newsPublisher, string newsLink, long publishTime, string newsThumbnail)
    {
        RapidApiApiResponseNews[] newsList = new RapidApiApiResponseNews[1];
        RapidApiApiResponse testRes = new RapidApiApiResponse() { News = newsList };
        RapidApiApiResponseResolutions[] resolutions = new [] { new RapidApiApiResponseResolutions() { Url = newsThumbnail } };
        newsList[0] = new RapidApiApiResponseNews()
        {
            Title = newsTitle,
            Publisher = newsPublisher,
            Link = newsLink,
            PublishTime = publishTime,
            Thumbnail = new RapidApiApiResponseThumbnail() { Resolutions = resolutions }
        };
        DateTime PublishTime_DateTime = _test.GetActualDateTime(publishTime);
        string formatePublishTime = _test.FormatDateTime(PublishTime_DateTime);
        int diffTimeInHour = _test.GetDiffTimeBetweenCurrentAndPublishTime(PublishTime_DateTime);
        
        FinancialNewsResponse[] expect = new [] { new FinancialNewsResponse(newsTitle, newsLink, newsPublisher, formatePublishTime, diffTimeInHour, newsThumbnail) };
        
        FinancialNewsResponse[] actual = _test.TransformJsonData(testRes);

        Assert.Equal(expect[0].Title, actual[0].Title);
        Assert.Equal(expect[0].Publisher, actual[0].Publisher);
        Assert.Equal(expect[0].Link, actual[0].Link);
        Assert.Equal(expect[0].PublishTime, actual[0].PublishTime);
        Assert.Equal(expect[0].Thumbnail, actual[0].Thumbnail);
        Assert.Equal(expect[0].DiffTimeInHour, actual[0].DiffTimeInHour);
    }
}