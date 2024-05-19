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
        Console.WriteLine("Receive request on: .../currency-country");
        var result = await _currService.GetCurrCountries();
        Console.WriteLine("Sending back response of currency-country!!!");
        return result;
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