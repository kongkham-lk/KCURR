package io.kongkham.kcurr.ApiClients.CurrencyApi;

import io.kongkham.kcurr.Models.CurrCountriesResponse;
import io.kongkham.kcurr.Interfaces.ExchangeRateApiClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

@Service("CurrencyApi")
@Order(2)
public class CurrencyApiApiClient implements ExchangeRateApiClient {
    private final WebClient _webClient;

    @Value("${currencyApi.api.app-id}")
    private String _currencyApiApiKey;

    public CurrencyApiApiClient(WebClient.Builder webClientBuilder) {
        this._webClient = webClientBuilder.build();
    }

    @Override
    public HashMap<String, Double> getLatestExchangeRates(String baseCurr) throws Exception {
        throw new Exception("Method not implemented");
    }

    @Override
    public HashMap<String, Double> getHistoricalExchangeRates(String baseCurr) throws Exception {
        throw new Exception("Method not implemented");
    }

    public HashMap<String, CurrCountriesResponse> getCurrCountries() {
        String url = "https://api.currencyapi.com/v3/currencies?apikey=" + _currencyApiApiKey;
        CurrencyApiApiResponse currCountriesRes = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyApiApiResponse.class)
                .block();
        HashMap<String, CurrCountriesResponse> currCountries = transformedJsonData(currCountriesRes);
        return currCountries;
    }

    @Override
    public TreeMap<String, Double> getExchangeRatesWeekTimeSeries(String baseCurr, String targetCurr, String timeSeriesRange) throws Exception {
        throw new Exception("Method not implemented");
    }

    private HashMap<String, CurrCountriesResponse> transformedJsonData(CurrencyApiApiResponse currCountriesRes) {
        HashMap<String, CurrencyApiApiResponseData> data = currCountriesRes.getData();
        HashMap<String, CurrCountriesResponse> currCountries = new HashMap<String, CurrCountriesResponse>();
        for (Map.Entry<String, CurrencyApiApiResponseData> element : data.entrySet()) {
            String key = (String) element.getKey();
            CurrencyApiApiResponseData dataField = (CurrencyApiApiResponseData) element.getValue();
            if (dataField != null) {
                String currCode = dataField.getCurrCode();
                String countryCurrName = dataField.getCurrNameWithCountryName();
                String display = currCode + " - " + countryCurrName;
                String currSymbol = dataField.getSymbolNative();
                String flagCode = currCode.substring(0, 2);
                CurrCountriesResponse currCountriesResponse = new CurrCountriesResponse(currCode, countryCurrName, display, currSymbol, flagCode);
                currCountries.put(key, currCountriesResponse);
            }
        }
        HashMap<String, CurrCountriesResponse> result = currCountries;
        return currCountries;
    }
}