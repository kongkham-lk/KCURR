package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.HashMap;

@Service("CurrencyBeacon")
public class CurrencyBeaconApiClient implements ExchangeRateApiClient {
    private final WebClient _webClient;

    @Value("${currencyBeacon.api.app-id}")
    private String _currencyBeaconApiKey;

    public CurrencyBeaconApiClient(WebClient.Builder webClientBuilder) {
        this._webClient = webClientBuilder.build();
    }

    public HashMap<String, Double> getLatestExchangeRates(String baseCurr) {
        String url = "https://api.currencybeacon.com/v1/latest?api_key=" + _currencyBeaconApiKey + "&base=" + baseCurr;
        CurrencyBeaconExchangeRateApiResponse exchangeRateApiResponse = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconExchangeRateApiResponse.class)
                .block();
        return exchangeRateApiResponse.getRates();
    }

    public HashMap<String, Double> getHistExchangeRates(String baseCurr) {
        LocalDate today = LocalDate.now();  // get the current date
        LocalDate yesterday = today.plusDays(-1);  // subtract 1 day
        String url = "https://api.currencybeacon.com/v1/historical?api_key=" + _currencyBeaconApiKey + "&base=" + baseCurr + "&date=" + yesterday;
        CurrencyBeaconExchangeRateApiResponse exchangeRateApiResponse = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconExchangeRateApiResponse.class)
                .block();
        return exchangeRateApiResponse.getRates();
    }

    public HashMap<String, CurrCountryReturnData> getCurrCountries() {
        String url = "https://api.currencybeacon.com/v1/currencies?api_key=" + _currencyBeaconApiKey;
        CurrencyBeaconCountriesApiResponse[] currCountriesRes = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconCountriesApiResponse[].class)
                .block();
        HashMap<String, CurrCountryReturnData> currCountries = transformedData(currCountriesRes);
        return currCountries;
    }

    private HashMap<String, CurrCountryReturnData> transformedData(CurrencyBeaconCountriesApiResponse[] currCountriesRes) {
        HashMap<String, CurrCountryReturnData> currCountries = new HashMap<String, CurrCountryReturnData>();
        for (int i = 0; i < currCountriesRes.length; i++) {
            CurrencyBeaconCountriesApiResponse currCountryDetail = currCountriesRes[i];
            String key = currCountryDetail.getCurrCode();
            String currCode = key;
            String name = currCountryDetail.getName();
            String display = key + " - " + name;
            String symbol = currCountryDetail.getSymbol();
            CurrCountryReturnData val = new CurrCountryReturnData(currCode, name, display, symbol);
            currCountries.put(key, val);
        }
        return currCountries;
    }
}
