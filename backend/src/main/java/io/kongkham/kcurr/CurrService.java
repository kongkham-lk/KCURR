package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.HashMap;

@Service
public class CurrService {

    private final ExchangeRateApiClient _currencyBeaconApiClient;
    private final ExchangeRateApiClient _currencyApiApiClient;
    private final ExchangeRateApiClient _cloudMersiveApiClient;

    public CurrService(@Qualifier("CurrencyBeacon") ExchangeRateApiClient currencyBeaconApiClient, @Qualifier("CurrencyApi") ExchangeRateApiClient currencyApiApiClient, @Qualifier("CloudMersive") ExchangeRateApiClient cloudMersiveApiClient) {
        this._currencyBeaconApiClient = currencyBeaconApiClient;
        this._currencyApiApiClient = currencyApiApiClient;
        this._cloudMersiveApiClient = cloudMersiveApiClient;
    }

    public double convert(double amount, String sourceCurrCountry, String targetCurrCountry) {
        return amount * checkRate(sourceCurrCountry, targetCurrCountry);
    }

    private double checkRate(String baseCurrCountry, String targetCurrCountry) {
        HashMap<String, Double> rates = _currencyBeaconApiClient.getLatestExchangeRates(baseCurrCountry);
        return rates.get(targetCurrCountry);
    }

    public HashMap<String, Double> getLatestExchangeRates(String baseCurr) {
        HashMap<String, Double> rates = _currencyBeaconApiClient.getLatestExchangeRates(baseCurr);
        return rates;
    }

    public HashMap<String, Double> getHistoricalExchangeRates(String baseCurr) {
        HashMap<String, Double> rates = _currencyBeaconApiClient.getHistoricalExchangeRates(baseCurr);
        return rates;
    }

    public HashMap<String, CurrCountryReturnData> getCurrCountries() {
        HashMap<String, CurrCountryReturnData> currCountries;
        try {
            currCountries = _currencyBeaconApiClient.getCurrCountries();
        } catch (Exception firstApiError) {
            try {
                currCountries = _currencyApiApiClient.getCurrCountries();
            } catch (Exception secondApiError) {
                currCountries = _cloudMersiveApiClient.getCurrCountries();
            }
        }
        return currCountries;
    }
}
