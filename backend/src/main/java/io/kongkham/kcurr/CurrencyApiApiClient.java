package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Service("CurrencyApi")
public class CurrencyApiApiClient implements ExchangeRateApiClient {
    private final WebClient _webClient;

    @Value("${currencyApi.api.app-id}")
    private String _currencyApiApiKey;

    public CurrencyApiApiClient(WebClient.Builder webClient) {
        this._webClient = webClient.build();
    }

    @Override
    public HashMap<String, Double> getLatestExchangeRates(String baseCurr) {
        return null;
    }

    @Override
    public HashMap<String, Double> getHistExchangeRates(String baseCurr) {
        return null;
    }

    public HashMap<String, CurrCountryReturnData> getCurrCountries() {
        String url = "https://api.currencyapi.com/v3/currencies?apikey=" + _currencyApiApiKey;
        CurrencyApiApiResponse currCountriesRes = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyApiApiResponse.class)
                .block();
        HashMap<String, CurrCountryReturnData> currCountries = transformedData(currCountriesRes);
        return currCountries;
    }

    private HashMap<String, CurrCountryReturnData> transformedData(CurrencyApiApiResponse currCountriesRes) {
        HashMap<String, CurrencyApiApiResponseData> data = currCountriesRes.getData();
        HashMap<String, CurrCountryReturnData> currCountries = new HashMap<String, CurrCountryReturnData>();
        Iterator dataIterator = data.entrySet().iterator();
        while (dataIterator.hasNext()) {
            Map.Entry element = (Map.Entry) dataIterator.next();
            String key = (String) element.getKey();
            CurrencyApiApiResponseData dataField = (CurrencyApiApiResponseData) element.getValue();
            String currCode = dataField.getCurrCode();
            String name = dataField.getName();
            String display = currCode + " - " + name;
            String symbol = dataField.getSymbolNative();
            CurrCountryReturnData currCountryReturnData = new CurrCountryReturnData(currCode, name, display, symbol);
            currCountries.put(key, currCountryReturnData);
        }
        HashMap<String, CurrCountryReturnData> result = currCountries;
        return currCountries;
    }
}