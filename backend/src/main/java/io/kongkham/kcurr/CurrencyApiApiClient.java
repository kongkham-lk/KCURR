package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service("CurrencyApi")
public class CurrencyApiApiClient implements ExchangeRateApiClient {
    private final WebClient _webClient;

    @Value("${currencyApi.api.app-id}")
    private String _currencyApiApiKey;

    public CurrencyApiApiClient(WebClient.Builder webClientBuilder) {
        this._webClient = webClientBuilder.build();
    }

    @Override
    public Mono<HashMap<String, Double>> getLatestExchangeRates(String baseCurr) {
        return null;
    }

    @Override
    public Mono<HashMap<String, Double>> getHistoricalExchangeRates(String baseCurr) {
        return null;
    }

    public Mono<HashMap<String, CurrCountryReturnData>> getCurrCountries() {
        String url = "https://api.currencyapi.com/v3/currencies?apikey=" + _currencyApiApiKey;
        CurrencyApiApiResponse currCountriesRes = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyApiApiResponse.class)
                .block();
        HashMap<String, CurrCountryReturnData> currCountries = transformedJsonData(currCountriesRes);
        return Mono.just(currCountries);
    }

    private HashMap<String, CurrCountryReturnData> transformedJsonData(CurrencyApiApiResponse currCountriesRes) {
        HashMap<String, CurrencyApiApiResponseData> data = currCountriesRes.getData();
        HashMap<String, CurrCountryReturnData> currCountries = new HashMap<String, CurrCountryReturnData>();
        for (Map.Entry<String,CurrencyApiApiResponseData> element : data.entrySet()) {
            String key = (String) element.getKey();
            CurrencyApiApiResponseData dataField = (CurrencyApiApiResponseData) element.getValue();
            if (dataField != null) {
                String currCode = dataField.getCurrCode();
                String countryCurrName = dataField.getCurrNameWithCountryName();
                String display = currCode + " - " + countryCurrName;
                String currSymbol = dataField.getSymbolNative();
                String flagCode = currCode.substring(0, 2);
                CurrCountryReturnData currCountryReturnData = new CurrCountryReturnData(currCode, countryCurrName, display, currSymbol, flagCode);
                currCountries.put(key, currCountryReturnData);
            }
        }
        HashMap<String, CurrCountryReturnData> result = currCountries;
        return currCountries;
    }
}