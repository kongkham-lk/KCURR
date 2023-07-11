package io.kongkham.kcurr;

import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class CurrService {

    private final CurrencyBeaconApiClient _currencyBeaconApiClient;
    private final CurrencyApiApiClient _currencyApiApiClient;

    public CurrService(CurrencyBeaconApiClient currencyBeaconApiClient, CurrencyApiApiClient currencyApiApiClient) {
        this._currencyBeaconApiClient = currencyBeaconApiClient;
        this._currencyApiApiClient = currencyApiApiClient;
    }

    public double convert(double amount, String sourceCurrCountry, String targetCurrCountry) {
        return amount * checkRate(sourceCurrCountry, targetCurrCountry);
    }

    private double checkRate(String baseCurrCountry, String targetCurrCountry) {
        // get rate from api
        ExchangeRateApiResponse latestRateApiResponse = _currencyBeaconApiClient.getLatestExchangeRates(baseCurrCountry);
        return latestRateApiResponse.getRates().get(targetCurrCountry);
    }

    public HashMap<String, Double> getLatestExchangeRates(String baseCurr) {
        HashMap<String, Double> rates = _currencyBeaconApiClient.getLatestExchangeRates(baseCurr).getRates();
        return rates;
    }

    public HashMap<String, Double> getHistExchangeRates(String baseCurr) {
        HashMap<String, Double> rates = _currencyBeaconApiClient.getHistExchangeRates(baseCurr).getRates();
        return rates;
    }

    public CurrCountriesApiResponse getCurrCountries() {
        return _currencyApiApiClient.getCurrCountries();
    }
}
