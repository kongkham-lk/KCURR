package io.kongkham.kcurr.Interfaces;

import io.kongkham.kcurr.Models.CurrCountriesResponse;

import java.util.HashMap;
import java.util.TreeMap;

public interface ExchangeRateApiClient {
    HashMap<String, Double> getLatestExchangeRates(String baseCurr);
    HashMap<String, Double> getHistoricalExchangeRates(String baseCurr);
    HashMap<String, CurrCountriesResponse> getCurrCountries();
    TreeMap<String, Double> getExchangeRatesWeekTimeSeries(String baseCurr, String targetCurr, String timeSeriesRange);
}
