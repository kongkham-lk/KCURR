package io.kongkham.kcurr;

import reactor.core.publisher.Mono;

import java.util.HashMap;

public interface ExchangeRateApiClient {
    HashMap<String, Double> getLatestExchangeRates(String baseCurr);
    HashMap<String, Double> getHistoricalExchangeRates(String baseCurr);
    HashMap<String, CurrCountryReturnData> getCurrCountries();
}
