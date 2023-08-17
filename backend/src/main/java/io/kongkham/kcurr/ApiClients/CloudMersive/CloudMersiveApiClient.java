package io.kongkham.kcurr.ApiClients.CloudMersive;

import io.kongkham.kcurr.Models.CurrCountriesResponse;
import io.kongkham.kcurr.Interfaces.ExchangeRateApiClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.TreeMap;

@Service("CloudMersive")
@Order(3)
public class CloudMersiveApiClient implements ExchangeRateApiClient {
    private final WebClient _webClient;
    @Value("${cloudMersive.api.app-id}")
    private String _cloudMersiveApiKey;

    public CloudMersiveApiClient(WebClient.Builder webClientBuilder) {
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

    @Override
    public HashMap<String, CurrCountriesResponse> getCurrCountries() {
        String url = "https://api.cloudmersive.com/currency/exchange-rates/list-available";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Apikey", _cloudMersiveApiKey);
        CloudMersiveApiResponse currCountriesRes = _webClient.post()
                .uri(url)
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .bodyToMono(CloudMersiveApiResponse.class)
                .block();
        HashMap<String, CurrCountriesResponse> currCountries = transformedJsonData(currCountriesRes);
        return currCountries;
    }

    @Override
    public TreeMap<String, Double> getExchangeRatesWeekTimeSeries(String baseCurr, String targetCurr, String timeSeriesRange) throws Exception {
        throw new Exception("Method not implemented");
    }

    private HashMap<String, CurrCountriesResponse> transformedJsonData(CloudMersiveApiResponse currCountriesRes) {
        CloudMersiveApiResponseCurrencies[] data = currCountriesRes.getCurrencies();
        HashMap<String, CurrCountriesResponse> currCountries = new HashMap<String, CurrCountriesResponse>();
        for (int i = 0; i < data.length; i++) {
            String key = data[i].getCurrCode();
            String currCode = key;
            String countryName = data[i].getCountryName();
            String currName = data[i].getCurrName();
            String display = currCode + " - " + countryName + " " + currName;
            String currSymbol = data[i].getCurrSymbol();
            String flagCode = data[i].getCurrFlagTwoLetterCode();
            CurrCountriesResponse currCountriesResponse = new CurrCountriesResponse(currCode, countryName, display, currSymbol, flagCode);
            currCountries.put(key, currCountriesResponse);
        }
        HashMap<String, CurrCountriesResponse> result = currCountries;
        return currCountries;
    }
}
