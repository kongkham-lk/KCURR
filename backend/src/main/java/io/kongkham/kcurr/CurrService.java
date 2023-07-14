package io.kongkham.kcurr;

import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class CurrService {

    private final CurrencyBeaconApiClient _currencyBeaconApiClient;
    private final ApiBcdApiClient _apiBcdApiClient;

    public CurrService(CurrencyBeaconApiClient currencyBeaconApiClient, ApiBcdApiClient apiBcdApiClient) {
        this._currencyBeaconApiClient = currencyBeaconApiClient;
        this._apiBcdApiClient = apiBcdApiClient;
    }

    public double convert(double amount, String sourceCurrCountry, String targetCurrCountry) {
        return amount * checkRate(sourceCurrCountry, targetCurrCountry);
    }

    private double checkRate(String baseCurrCountry, String targetCurrCountry) {
        // get rate from api
        currencyBeaconExchangeRateApiResponse latestRateApiResponse = _currencyBeaconApiClient.getLatestExchangeRates(baseCurrCountry);
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
        currencyBeaconCountriesApiResponse[] currCountriesRes = _currencyBeaconApiClient.getCurrCountries();
        ApiBcdApiResponse[] countriesDetailRes = _apiBcdApiClient.getCountriesData();
        HashMap<String, CurrCountryReturnData> currCountries = new HashMap<String, CurrCountryReturnData>();
        for (int i = 0; i < countriesDetailRes.length; i++) {
            currencyBeaconCountriesApiResponse countryDetail = currCountriesRes[i];
            String key = countryDetail.getShortCode();
            String currCode = key;
            String name = countryDetail.getName();
            String display = key + " - " + name;
            String symbol = countryDetail.getSymbol();
            CurrCountryReturnData val = new CurrCountryReturnData(currCode, name, display, symbol);
            currCountries.put(key, val);
        }
        return currCountries;
    }
}
