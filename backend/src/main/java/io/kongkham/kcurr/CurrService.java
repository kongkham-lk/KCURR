package io.kongkham.kcurr;

import org.springframework.stereotype.Service;

@Service
public class CurrService {

    private final ExchangeRateApiClient _ExchangeRateApiClient;


    public CurrService(ExchangeRateApiClient exchangeRateApiClient) {
        this._ExchangeRateApiClient = exchangeRateApiClient;
    }

    public double convert(double amount, String sourceCurrCountry, String targetCurrCountry) {
        return amount * checkRate(sourceCurrCountry, targetCurrCountry);
    }

    private double checkRate(String baseCurrCountry, String targetCurrCountry) {
        // get rate from api
        ExchangeRateLatestApiResponse exchangeRateApiResponse = _ExchangeRateApiClient.getExchangeRatesLatest(baseCurrCountry);
        double targetRate =  exchangeRateApiResponse.getConversionRates().get(targetCurrCountry);
        return targetRate;
    }

    public ExchangeRateApiResponse getExchangeRate(String baseCurr, String dataSet) {
        if (dataSet.equals("lastest")) {
            return _ExchangeRateApiClient.getExchangeRatesLatest(baseCurr);
        } else {
            return _ExchangeRateApiClient.getExchangeRatesHist(baseCurr);
        }
    }

    public ExchangeCurrCountriesApiResponse getCurrCountry() {
        return _ExchangeRateApiClient.getCurrCountry();
    }
}
