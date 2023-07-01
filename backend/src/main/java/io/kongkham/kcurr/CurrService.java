package io.kongkham.kcurr;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;

@Service
public class CurrService {
    private final WebClient webClient;

    @Value("${openexchangerates.api.app-id}")
    private String apiKey;
    public CurrService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public double convert(double amount, String sourceCurr, String targetCurr) {
        return amount * checkRate(sourceCurr, targetCurr);
    }

    private double checkRate(String sourceCurr, String targetCurr) {
        // get rate from api
        ExchangeApiResponse exchangeApiResponse = getExchangeRates((sourceCurr));

        HashMap<String, Double> rates = new HashMap<String, Double>();
        rates.put(targetCurr, 35.32);
        CurrData curr = new CurrData(sourceCurr, rates);
        return curr.getRates().get(targetCurr);
    }

    public ExchangeApiResponse getExchangeRates(String sourceCurr) {
        String url = "https://v6.exchangerate-api.com/v6/" + apiKey + "/latest/" + sourceCurr;
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ExchangeApiResponse.class)
                .block();
    }
}
