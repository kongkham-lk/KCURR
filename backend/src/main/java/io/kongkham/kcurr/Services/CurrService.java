package io.kongkham.kcurr.Services;

import io.kongkham.kcurr.Interfaces.ExchangeRateApiClient;
import io.kongkham.kcurr.Interfaces.FinancialNewsApiClient;
import io.kongkham.kcurr.Models.CurrCountriesResponse;
import io.kongkham.kcurr.Models.RateTimeSeriesResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

@Service
public class CurrService {

    private final ExchangeRateApiClient _currencyBeaconApiClient;
    private final ExchangeRateApiClient _currencyApiApiClient;
    private final ExchangeRateApiClient _cloudMersiveApiClient;
    private final FinancialNewsApiClient _rapidApiApiClient;

    public CurrService(@Qualifier("CurrencyBeacon") ExchangeRateApiClient currencyBeaconApiClient, @Qualifier("CurrencyApi") ExchangeRateApiClient currencyApiApiClient, @Qualifier("CloudMersive") ExchangeRateApiClient cloudMersiveApiClient, @Qualifier("RapidApi") FinancialNewsApiClient rapidApiApiClient) {
        this._currencyBeaconApiClient = currencyBeaconApiClient;
        this._currencyApiApiClient = currencyApiApiClient;
        this._cloudMersiveApiClient = cloudMersiveApiClient;
        this._rapidApiApiClient = rapidApiApiClient;
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

    public HashMap<String, CurrCountriesResponse> getCurrCountries() {
        HashMap<String, CurrCountriesResponse> currCountries;
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
        String[] dayRange = new String[range];
        String[] monthRange = new String[range];
        double[] changingRates = new double[range];
        double highest = Integer.MIN_VALUE;
        double lowest = Integer.MAX_VALUE;
        int i = 0;
        for (Map.Entry<String, Double> element : timeSeries.entrySet()) {
            String fullDate = element.getKey(); // return yyyy/MM/dd
            String year = fullDate.substring(0,4); // get yyyy
            String monthNum = fullDate.substring(5,7); // get MM
            Month monthName = Month.of(Integer.parseInt(monthNum)); // get the full name of the month
            String monthAbbr = monthName.toString().substring(0,3);
            String formatMonthAbbr = monthAbbr.substring(0,1) + monthAbbr.substring(1).toLowerCase();
            String day = fullDate.substring(fullDate.length()-2); // get dd
            dayRange[i] = day + " " + formatMonthAbbr;
            monthRange[i] = formatMonthAbbr + " " + year;
            double rate = element.getValue(); // return rate
            changingRates[i] = rate;
            if (highest < rate) {
                highest = rate;
            }
            if (lowest > rate) {
                lowest = rate;
            }
            i++;
        }
        RateTimeSeriesResponse timeSeriesDetail = new RateTimeSeriesResponse(dayRange, monthRange, changingRates, highest, lowest);
        targetCurrTimeSeries.put(targetCurr, timeSeriesDetail);
        return targetCurrTimeSeries;
    }
}
