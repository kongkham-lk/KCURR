package io.kongkham.kcurr;

import java.util.HashMap;
import java.util.TreeMap;

public interface ExchangeRateApiClient {
    HashMap<String, Double> getLatestExchangeRates(String baseCurr);
    HashMap<String, Double> getHistoricalExchangeRates(String baseCurr);
    HashMap<String, CurrCountriesReturnData> getCurrCountries();
    TreeMap<String, Double> getExchangeRatesWeekTimeSeries(String baseCurr, String targetCurr, String timeSeriesRange);
    FinancialNewsResponse[] getFinancialNews();
}
