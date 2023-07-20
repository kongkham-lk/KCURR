package io.kongkham.kcurr;

import java.util.HashMap;

public interface ExchangeRateApiClient {
    HashMap<String, Double> getLatestExchangeRates(String baseCurr);
    HashMap<String, Double> getHistExchangeRates(String baseCurr);
    HashMap<String, CurrCountryReturnData> getCurrCountries();
}
