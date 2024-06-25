using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.JSInterop;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class CurrController : ControllerBase
{
    private readonly CurrService _currService;
    private readonly ILogger<CurrController> _logger;

    public CurrController(CurrService currService, ILogger<CurrController> logger)
    {
        _currService = currService;
        _logger = logger;
    }

    [HttpPost("convert")]
    public async Task<double> GetConvertCurr([FromBody] ConvertRequest data)
    {
        double amount = data.Amount;
        string baseCurr = data.BaseCurr;
        string targetCurr = data.TargetCurr;
        var result = await _currService.Convert(amount, baseCurr, targetCurr);
        return result;
    }

    [HttpPost("rate-latest")]
    public async Task<Dictionary<string, double>> GetLatestExchangeRates([FromBody] RateTableRequest data)
    {
        string baseCurr = data.BaseCurr;
        Dictionary<string, double> result = await _currService.GetLatestExchangeRates(baseCurr);
        return result;
    }

    [HttpPost("rate-hist")]
    public async Task<Dictionary<string, double>> GetHistoricalExchangeRates([FromBody] RateTableRequest data)
    {
        string baseCurr = data.BaseCurr;
        Dictionary<string, double> result = await _currService.GetHistoricalExchangeRates(baseCurr);
        return result;
    }

    [HttpGet("currency-country")]
    public async Task<Dictionary<string, CurrCountriesResponse>> GetCurrCountriesFromCurrencyBeacon()
    {
        //_logger.LogInformation("Received request from frontend!!!");
        var result = await _currService.GetCurrCountries();
        //_logger.LogInformation($"Response back data: {result}");
        return result;
    }

    [HttpPost("rate-timeSeries")]
    public async Task<Dictionary<string, RateTimeSeriesResponse>> GetExchangeRatesTimeSeries(
        [FromBody] RateTimeSeriesRequest data)
    {
        string baseCurr = data.BaseCurr;
        string targetCurr = data.TargetCurr;
        string timeSeriesRange = data.TimeSeriesRange;
        bool isNewUpdateRequest = data.IsNewUpdateRequest;
        Dictionary<string, RateTimeSeriesResponse> result =
            await _currService.GetExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange, isNewUpdateRequest);
        return result;
    }
}