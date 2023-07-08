package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class ExchangeRateApiClient {
    private final WebClient _webClient;

    @Value("${openExchangeRates.api.app-id}")
    private String _apiKey;

    public ExchangeRateApiClient(WebClient.Builder webClientBuilder) {
        this._webClient = webClientBuilder.build();
    }

    public ExchangeRateLatestApiResponse getExchangeRatesLatest(String sourceCurr) {
        String url = "https://v6.exchangerate-api.com/v6/" + _apiKey + "/latest/" + sourceCurr;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ExchangeRateLatestApiResponse.class)
                .block();
    }

    public ExchangeRateHistApiResponse getExchangeRatesHist(String baseCurr) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        LocalDate today = LocalDate.now();  // get the current date
        LocalDate yesterday= today.plusDays(-1);  // subtract 1 day
        String formateYesterday = dtf.format(yesterday);
        String url = "https://v6.exchangerate-api.com/v6/" + _apiKey + "/latest/" + baseCurr + "/" + formateYesterday;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ExchangeRateHistApiResponse.class)
                .block();
    }

    public ExchangeCurrCountriesApiResponse getCurrCountry() {
        String url = "https://v6.exchangerate-api.com/v6/" + _apiKey + "/codes";
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ExchangeCurrCountriesApiResponse.class)
                .block();
    }
}
