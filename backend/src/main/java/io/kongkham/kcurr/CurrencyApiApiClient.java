package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

@Service("CurrencyApi")
public class CurrencyApiApiClient implements ExchangeRateApiClient {
    private final WebClient _webClient;

    @Value("${currencyApi.api.app-id}")
    private String _currencyApiApiKey;

    public CurrencyApiApiClient(WebClient.Builder webClientBuilder) {
        this._webClient = webClientBuilder.build();
    }

    @Override
    public HashMap<String, Double> getLatestExchangeRates(String baseCurr) {
        return null;
    }

    @Override
    public HashMap<String, Double> getHistoricalExchangeRates(String baseCurr) {
        return null;
    }

    public HashMap<String, CurrCountriesReturnData> getCurrCountries() {
        String url = "https://api.currencyapi.com/v3/currencies?apikey=" + _currencyApiApiKey;
        CurrencyApiApiResponse currCountriesRes = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyApiApiResponse.class)
                .block();
        HashMap<String, CurrCountriesReturnData> currCountries = transformedJsonData(currCountriesRes);
        return currCountries;
    }

    @Override
    public TreeMap<String, Double> getExchangeRatesWeekTimeSeries(String baseCurr, String targetCurr, String timeSeriesRange) {
        return null;
    }

    private HashMap<String, CurrCountriesReturnData> transformedJsonData(CurrencyApiApiResponse currCountriesRes) {
        HashMap<String, CurrencyApiApiResponseData> data = currCountriesRes.getData();
        HashMap<String, CurrCountriesReturnData> currCountries = new HashMap<String, CurrCountriesReturnData>();
        for (Map.Entry<String,CurrencyApiApiResponseData> element : data.entrySet()) {
            String key = (String) element.getKey();
            CurrencyApiApiResponseData dataField = (CurrencyApiApiResponseData) element.getValue();
            if (dataField != null) {
                String currCode = dataField.getCurrCode();
                String countryCurrName = dataField.getCurrNameWithCountryName();
                String display = currCode + " - " + countryCurrName;
                String currSymbol = dataField.getSymbolNative();
                String flagCode = currCode.substring(0, 2);
                CurrCountriesReturnData currCountriesReturnData = new CurrCountriesReturnData(currCode, countryCurrName, display, currSymbol, flagCode);
                currCountries.put(key, currCountriesReturnData);
            }
        }
        HashMap<String, CurrCountriesReturnData> result = currCountries;
        return currCountries;
    }
}
