package io.kongkham.kcurr;

import org.springframework.stereotype.Service;

import java.util.HashMap;

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
        ExchangeRateApiResponse latestRateApiResponse = _ExchangeRateApiClient.getLatestExchangeRates(baseCurrCountry);
        double targetRate =  latestRateApiResponse.getData().get(targetCurrCountry).getValue();
        return targetRate;
    }

    public ExchangeRateApiResponse getExchangeRates(String baseCurr, String dataSet) {
        if (dataSet.equals("latest")) {
            return _ExchangeRateApiClient.getLatestExchangeRates(baseCurr);
        } else {
            return _ExchangeRateApiClient.getHistExchangeRates(baseCurr);
        }
    }

    public CurrCountriesApiResponse getCurrCountries() {
        CurrCountriesApiResponse currCountries = _ExchangeRateApiClient.getCurrCountries();
        return currCountries;
    }
}
