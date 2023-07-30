package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

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

    public HashMap<String, CurrCountriesReturnData> getCurrCountries() {
        HashMap<String, CurrCountriesReturnData> currCountries;
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

    public HashMap<String, RateTimeSeriesResponse> getExchangeRatesWeekTimeSeries(String baseCurr, String targetCurr, String timeSeriesRange) {
        TreeMap<String, Double> timeSeries = _currencyBeaconApiClient.getExchangeRatesWeekTimeSeries(baseCurr, targetCurr, timeSeriesRange);
        HashMap<String, RateTimeSeriesResponse> targetCurrTimeSeries = new HashMap<String, RateTimeSeriesResponse>();
        int range = timeSeries.size();
        String[] dateRange = new String[range];
        double[] changingRates = new double[range];
        double highest = Integer.MIN_VALUE;
        double lowest = Integer.MAX_VALUE;
        int i = 0;
        for (Map.Entry<String, Double> element : timeSeries.entrySet()) {
            dateRange[i] = element.getKey();
            double rate = element.getValue();
            changingRates[i] = rate;
            if (highest < rate) {
                highest = rate;
            }
            if (lowest > rate) {
                lowest = rate;
            }
            i++;
        }
        RateTimeSeriesResponse timeSeriesDetail = new RateTimeSeriesResponse(dateRange, changingRates, highest, lowest);
        targetCurrTimeSeries.put(targetCurr, timeSeriesDetail);
        return targetCurrTimeSeries;
    }
}
