using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class CurrController : ControllerBase
{
    private readonly CurrService _currService;

    public CurrController(CurrService currService)
    {
        _currService = currService;
    }

    [HttpPost("convert")]
    public async Task<double> GetConvertCurr([FromBody] ConvertRequest data)
    {
        double amount = data.Amount;
        string baseCurr = data.BaseCurr;
        string targetCurr = data.TargetCurr;
        return await _currService.Convert(amount, baseCurr, targetCurr);
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
        return await _currService.GetCurrCountries();
    }

    [HttpPost("rate-timeSeries")]
    public async Task<Dictionary<string, RateTimeSeriesResponse>> GetExchangeRatesTimeSeries(
        [FromBody] RateTimeSeriesRequest data)
    {
        string baseCurr = data.BaseCurr;
        string targetCurr = data.TargetCurr;
        string timeSeriesRange = data.TimeSeriesRange;
        Dictionary<string, RateTimeSeriesResponse> result =
            await _currService.GetExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange);
        return result;
    }
}