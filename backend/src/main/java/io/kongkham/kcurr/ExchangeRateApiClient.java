package io.kongkham.kcurr;

import reactor.core.publisher.Mono;

import java.util.HashMap;

public interface ExchangeRateApiClient {
    Mono<HashMap<String, Double>> getLatestExchangeRates(String baseCurr);
    Mono<HashMap<String, Double>> getHistoricalExchangeRates(String baseCurr);
    Mono<HashMap<String, CurrCountryReturnData>> getCurrCountries();
}
