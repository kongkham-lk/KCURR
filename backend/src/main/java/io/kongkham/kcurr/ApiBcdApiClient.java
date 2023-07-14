package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ApiBcdApiClient {
    private final WebClient _webClient;

    @Value("${api-bdc.api.app-id}")
    private String _apiBdcApiKey;

    public ApiBcdApiClient(WebClient.Builder webClientBuilder) {
        this._webClient = webClientBuilder.build();
    }

    public ApiBcdApiResponse[] getCountriesData() {
        String url = "https://api-bdc.net/data/countries?localityLanguage=en&key=" + _apiBdcApiKey;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ApiBcdApiResponse[].class)
                .block();
    }
}
