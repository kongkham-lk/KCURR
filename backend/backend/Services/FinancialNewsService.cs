using backend.Interfaces;
using backend.Models;

namespace backend.Services;

public class FinancialNewsService
{
    private readonly List<IFinancialNewsApiClient> _financialNewsApiClients;

    public FinancialNewsService(IEnumerable<IFinancialNewsApiClient> financialNewsApiClients)
    {
        _financialNewsApiClients = financialNewsApiClients.ToList();
    }

    public async Task<FinancialNewsResponse[]> GetFinancialNews(string newsTopic)
    {
        FinancialNewsResponse[] news = null!;
        foreach (var apiClient in _financialNewsApiClients)
        {
            try
            {
                news = await apiClient.GetFinancialNews(newsTopic);
            } catch (Exception e)
            {
                Console.WriteLine("Cannot retrieve news: " + e);
            }
        }
        return news;
    }
}