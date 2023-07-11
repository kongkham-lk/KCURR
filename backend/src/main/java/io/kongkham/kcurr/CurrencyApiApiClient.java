package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class CurrencyApiApiClient {
    private final WebClient _webClient;

    @Value("${currencyApi.api.app-id}")
    private String _currCountriesApiKey;

    public CurrencyApiApiClient(WebClient.Builder webClientBuilder) {
        this._webClient = webClientBuilder.build();
    }
    
    public CurrCountriesApiResponse getCurrCountries() {
        String url = "https://api.currencyapi.com/v3/currencies?apikey=" + _currCountriesApiKey;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrCountriesApiResponse.class)
                .block();
    }
}
