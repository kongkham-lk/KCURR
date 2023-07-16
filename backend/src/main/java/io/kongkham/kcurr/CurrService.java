package io.kongkham.kcurr;

import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class CurrService {

    private final CurrencyBeaconApiClient _currencyBeaconApiClient;

    public CurrService(CurrencyBeaconApiClient currencyBeaconApiClient) {
        this._currencyBeaconApiClient = currencyBeaconApiClient;
    }

    public double convert(double amount, String sourceCurrCountry, String targetCurrCountry) {
        return amount * checkRate(sourceCurrCountry, targetCurrCountry);
    }

    private double checkRate(String baseCurrCountry, String targetCurrCountry) {
        // get rate from api
        CurrencyBeaconExchangeRateApiResponse latestRateApiResponse = _currencyBeaconApiClient.getLatestExchangeRates(baseCurrCountry);
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

    public HashMap<String, CurrCountryReturnData> getCurrCountries() {
        CurrencyBeaconCountriesApiResponse[] currCountriesRes = _currencyBeaconApiClient.getCurrCountries();
        HashMap<String, CurrCountryReturnData> currCountries = new HashMap<String, CurrCountryReturnData>();
        for (int i = 0; i < currCountriesRes.length; i++) {
            CurrencyBeaconCountriesApiResponse currCountryDetail = currCountriesRes[i];
            String key = currCountryDetail.getShortCode();
            String currCode = key;
            String name = currCountryDetail.getName();
            String display = key + " - " + name;
            String symbol = currCountryDetail.getSymbol();
            CurrCountryReturnData val = new CurrCountryReturnData(currCode, name, display, symbol);
            currCountries.put(key, val);
        }
        return currCountries;
    }
}
