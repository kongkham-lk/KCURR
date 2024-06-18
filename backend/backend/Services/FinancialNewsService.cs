using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class FinancialNewsService
{
    private readonly List<IFinancialNewsApiClient> _financialNewsApiClients;
    private readonly ILogger<FinancialNewsService> _logger;
    private int TotalRetryApiKey { get; set; } = 3;

    public FinancialNewsService(IEnumerable<IFinancialNewsApiClient> financialNewsApiClients, ILogger<FinancialNewsService> logger)
    {
        _financialNewsApiClients = financialNewsApiClients.ToList();
        _logger = logger;
    }

    public async Task<FinancialNewsResponse[]> GetFinancialNews(string newsTopic)
    {
        FinancialNewsResponse[] news = null!;
        foreach (var apiClient in _financialNewsApiClients)
        {
            try
            {
                TotalRetryApiKey--;
                news = await apiClient.GetFinancialNews(newsTopic, false);

                if (news is null)
                    throw new NullReferenceException();
            }
            catch (Exception e)
            {
                news = await RetryToGetFinancialNews(apiClient, news, newsTopic);

                if (news is null)
                {
                    _logger.LogInformation("Cannot retrieve news: " + e);
                    Console.WriteLine("Cannot retrieve news: " + e);
                }
            }
        }
        return news;
    }

    private async Task<FinancialNewsResponse[]> RetryToGetFinancialNews(IFinancialNewsApiClient apiClient, FinancialNewsResponse[] response, string newsTopic)
    {
        while (TotalRetryApiKey > 0 && response is null)
        {
            response = await apiClient.GetFinancialNews(newsTopic, true); // invoke method again by trying to use another api key
            TotalRetryApiKey--;

            if (response is not null)
                break;
            else if (TotalRetryApiKey == 0)
                _logger.LogInformation($"None of the currCountries api key works!!!");
        }
        TotalRetryApiKey = 3; // reset total retry api key when data return
        return response;
    }
}