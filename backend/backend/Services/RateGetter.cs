using backend.Interfaces;

namespace backend.Services;

public class RateGetter
{
    private readonly List<IExchangeRateApiClient> _exchangeRateApiClients;
    
    public enum Mode
    {
        Latest,
        Historical
    }
    
    public RateGetter(IEnumerable<IExchangeRateApiClient> exchangeRateApiClients)
    {
        _exchangeRateApiClients = exchangeRateApiClients.ToList();
    }
    
    public async Task<Dictionary<string, double>> GetRates(string baseCurr,
        Mode mode)
    {
        Dictionary<string, double> rates = null!;
        foreach (var apiClientElement in _exchangeRateApiClients)
        {
            try
            {
                if (mode == Mode.Historical)
                    rates = await apiClientElement.GetHistoricalExchangeRates(baseCurr);
                else if (mode == Mode.Latest)
                    rates = await apiClientElement.GetLatestExchangeRates(baseCurr);
            }
            catch (Exception e)
            {
                continue;
            }
        }
        return rates;
    }
}