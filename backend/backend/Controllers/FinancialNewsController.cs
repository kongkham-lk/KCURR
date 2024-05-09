using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
public class FinancialNewsController : ControllerBase
{
    private readonly FinancialNewsService _financialNewsService;

    public FinancialNewsController(FinancialNewsService financialNewsService)
    {
        _financialNewsService = financialNewsService;
    }

    [HttpPost("news")]
    public async Task<FinancialNewsResponse[]> GetFinancialNews([FromBody] FinancialNewsRequest data)
    {
        string newsTopic = data.NewsTopic;
        return await _financialNewsService.GetFinancialNews(newsTopic);
    }
}