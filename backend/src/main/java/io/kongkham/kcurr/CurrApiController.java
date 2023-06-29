package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
public class ExchangeRateApiController {
    private final WebClient webClient;

    @Value("${openexchangerates.api.app-id}")
    private String apiKey;

    public ExchangeRateApiController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @GetMapping("/exchange-rate")
    public String getExchangeRates() {
        String url = "https://v6.exchangerate-api.com/v6/" + apiKey + "/codes";
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block()
                .onErrorMap(throwable -> new APIRequestException("Failed to fetch exchange rates", throwable));
        ;
    }
}