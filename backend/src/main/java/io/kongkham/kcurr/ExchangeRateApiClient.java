package io.kongkham.kcurr;

import java.util.HashMap;

public interface ExchangeRateApiClient {
    HashMap<String, Double> getLatestExchangeRates(String baseCurr);
    HashMap<String, Double> getHistoricalExchangeRates(String baseCurr);
    HashMap<String, CurrCountriesReturnData> getCurrCountries();
    HashMap<String, Double> getExchangeRatesWeekTimeSeries(String baseCurr, String targetCurr);
}
