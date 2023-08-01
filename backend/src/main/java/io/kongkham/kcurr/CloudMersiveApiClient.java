package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.TreeMap;

@Service("CloudMersive")
public class CloudMersiveApiClient implements ExchangeRateApiClient {
    private final WebClient _webClient;
    @Value("${cloudMersive.api.app-id}")
    private String _cloudMersiveApiKey;

    public CloudMersiveApiClient(WebClient.Builder webClientBuilder) {
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

    @Override
    public HashMap<String, CurrCountriesReturnData> getCurrCountries() {
        String url = "https://api.cloudmersive.com/currency/exchange-rates/list-available";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Apikey", _cloudMersiveApiKey);
        CloudMersiveApiResponse currCountriesRes = _webClient.post()
                .uri(url)
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .bodyToMono(CloudMersiveApiResponse.class)
                .block();
        HashMap<String, CurrCountriesReturnData> currCountries = transformedJsonData(currCountriesRes);
        return currCountries;
    }

    @Override
    public TreeMap<String, Double> getExchangeRatesWeekTimeSeries(String baseCurr, String targetCurr, String timeSeriesRange) {
        return null;
    }

    @Override
    public FinancialNewsResponse[] getFinancialNews() {
        return new FinancialNewsResponse[0];
    }

    private HashMap<String, CurrCountriesReturnData> transformedJsonData(CloudMersiveApiResponse currCountriesRes) {
        CloudMersiveApiResponseCurrencies[] data = currCountriesRes.getCurrencies();
        HashMap<String, CurrCountriesReturnData> currCountries = new HashMap<String, CurrCountriesReturnData>();
        for (int i = 0; i < data.length; i++) {
            String key = data[i].getCurrCode();
            String currCode = key;
            String countryName = data[i].getCountryName();
            String currName = data[i].getCurrName();
            String display = currCode + " - " + countryName + " " + currName;
            String currSymbol = data[i].getCurrSymbol();
            String flagCode = data[i].getCurrFlagTwoLetterCode();
            CurrCountriesReturnData currCountriesReturnData = new CurrCountriesReturnData(currCode, countryName, display, currSymbol, flagCode);
            currCountries.put(key, currCountriesReturnData);
        }
        HashMap<String, CurrCountriesReturnData> result = currCountries;
        return currCountries;
    }
}
