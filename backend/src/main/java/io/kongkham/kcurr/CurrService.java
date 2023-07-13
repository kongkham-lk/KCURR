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

    public HashMap<String, CurrCountryResRestructure> getCurrCountries() {
        CurrCountriesApiResponse[] countriesDetailRes = _currencyBeaconApiClient.getCurrCountries();
        HashMap<String, CurrCountryResRestructure> currCountries = new HashMap<String, CurrCountryResRestructure>();
        for (int i = 0; i < countriesDetailRes.length; i++) {
            CurrCountriesApiResponse countryDetail = countriesDetailRes[i];
            String key = countryDetail.getShortCode();
            String currCode = key;
            String name = countryDetail.getName();
            String display = key + " - " + name;
            String symbol = countryDetail.getSymbol();
            CurrCountryResRestructure val = new CurrCountryResRestructure(currCode, name, display, symbol);
            currCountries.put(key, val);
        }
        return currCountries;
    }
}
