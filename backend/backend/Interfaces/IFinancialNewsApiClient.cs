using backend.Models;

namespace backend.Interfaces;

public interface IFinancialNewsApiClient
{
    Task<FinancialNewsResponse[]> GetFinancialNews(string newsTopic, bool getAnotherApiKey);
}