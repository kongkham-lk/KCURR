package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;

@Service
public class CurrencyBeaconApiClient implements ApiClient {
    private final WebClient _webClient;

    @Value("${currencyBeacon.api.app-id}")
    private String _currencyBeaconApiKey;

    public CurrencyBeaconApiClient(WebClient.Builder webClientBuilder) {
        this._webClient = webClientBuilder.build();
    }

    public CurrencyBeaconExchangeRateApiResponse getLatestExchangeRates(String baseCurr) {
        String url = "https://api.currencybeacon.com/v1/latest?api_key=" + _currencyBeaconApiKey + "&base=" + baseCurr;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconExchangeRateApiResponse.class)
                .block();
    }

    public CurrencyBeaconExchangeRateApiResponse getHistExchangeRates(String baseCurr) {
        LocalDate today = LocalDate.now();  // get the current date
        LocalDate yesterday = today.plusDays(-1);  // subtract 1 day
        String url = "https://api.currencybeacon.com/v1/historical?api_key=" + _currencyBeaconApiKey + "&base=" + baseCurr + "&date=" + yesterday;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconExchangeRateApiResponse.class)
                .block();
    }

    public CurrencyBeaconCountriesApiResponse[] getCurrCountries() {
        String url = "https://api.currencybeacon.com/v1/currencies?api_key=" + _currencyBeaconApiKey;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconCountriesApiResponse[].class)
                .block();
    }
}
