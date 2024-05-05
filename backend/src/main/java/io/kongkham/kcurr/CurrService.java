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
        return latestRateApiResponse.getResponse().getRates().get(targetCurrCountry);
    }

    public HashMap<String, Double> getLatestExchangeRates(String baseCurr) {
        HashMap<String, Double> rates = _ExchangeRateApiClient.getLatestExchangeRates(baseCurr).getResponse().getRates();
        return rates;
    }

    public HashMap<String, Double> getHistExchangeRates(String baseCurr) {
        HashMap<String, Double> rates = _ExchangeRateApiClient.getHistExchangeRates(baseCurr).getResponse().getRates();
        return rates;
    }

    public CurrCountriesApiResponse getCurrCountries() {
        return _ExchangeRateApiClient.getCurrCountries();
    }
}
