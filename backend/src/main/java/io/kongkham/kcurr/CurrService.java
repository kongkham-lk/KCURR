package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class CurrService {

    private final ExchangeRateApiClient _currencyBeaconApiClient;
    private final ExchangeRateApiClient _currencyApiApiClient;

    public CurrService(@Qualifier("CurrencyBeacon") ExchangeRateApiClient currencyBeaconApiClient, @Qualifier("CurrencyApi") ExchangeRateApiClient currencyApiApiClient) {
        this._currencyBeaconApiClient = currencyBeaconApiClient;
        this._currencyApiApiClient = currencyApiApiClient;
    }

    public double convert(double amount, String sourceCurrCountry, String targetCurrCountry) {
        return amount * checkRate(sourceCurrCountry, targetCurrCountry);
    }

    private double checkRate(String baseCurrCountry, String targetCurrCountry) {
        // get rate from api
        HashMap<String, Double> latestRateApiResponse = _currencyBeaconApiClient.getLatestExchangeRates(baseCurrCountry);
        return latestRateApiResponse.get(targetCurrCountry);
    }

    public HashMap<String, Double> getLatestExchangeRates(String baseCurr) {
        HashMap<String, Double> rates = _currencyBeaconApiClient.getLatestExchangeRates(baseCurr);
        return rates;
    }

    public HashMap<String, Double> getHistExchangeRates(String baseCurr) {
        HashMap<String, Double> rates = _currencyBeaconApiClient.getHistExchangeRates(baseCurr);
        return rates;
    }

    public HashMap<String, CurrCountryReturnData> getCurrCountriesFromCurrencyBeacon() {
        HashMap<String, CurrCountryReturnData> currCountriesRes = _currencyBeaconApiClient.getCurrCountries();
        return currCountriesRes;
    }

    public HashMap<String, CurrCountryReturnData> getCurrCountriesFromCurrencyApi() {
        HashMap<String, CurrCountryReturnData> currCountriesRes = _currencyApiApiClient.getCurrCountries();
        return currCountriesRes;
    }
}
