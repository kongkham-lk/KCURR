package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class ExchangeRatesGetter {
    private final WebClient webClient;

    @Value("${openexchangerates.api.app-id}")
    private String apiKey;

    public ExchangeRatesGetter(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public ExchangeApiResponse getExchangeRates(String sourceCurr) {
        String url = "https://v6.exchangerate-api.com/v6/" + apiKey + "/latest/" + sourceCurr;
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ExchangeApiResponse.class)
                .block();
    }
    public ExchangeApiResponse getExchangeRatesHist(String baseCurr) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        LocalDate today = LocalDate.now();  // get the current date
        LocalDate yesterday= today.plusDays(-1);  // subtract 1 day
        String formateYesterday = dtf.format(yesterday);
        String url = "https://v6.exchangerate-api.com/v6/" + apiKey + "/latest/" + baseCurr + "/" + formateYesterday;
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ExchangeApiResponse.class)
                .block();
    }
}
