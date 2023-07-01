package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

@RestController
@RequestMapping("/api")
public class CurrApiController {
    private final WebClient webClient;
//    private WebClient.Builder webClientBuilder;

    @Value("${openexchangerates.api.app-id}")
    private String apiKey;

    public CurrApiController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @GetMapping("/exchange-rate")
    public String getExchangeRates() {
        String url = "https://v6.exchangerate-api.com/v6/" + apiKey + "/codes";
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

//    @GetMapping("/convert")
//    public ExchangeApiResponse getExchangeRates(@RequestParam String sourceCurr) {
//        String url = "https://v6.exchangerate-api.com/v6/" + apiKey + "/latest/" + sourceCurr;
//        return webClient.get()
//                .uri(url)
//                .retrieve()
//                .bodyToMono(ExchangeApiResponse.class)
//                .block();
//    }
}