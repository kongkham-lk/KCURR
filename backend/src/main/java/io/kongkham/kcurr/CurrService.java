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

    public double convert(double amount, String sourceCurrCountry, String targetCurrCountry) {
        return amount * checkRate(sourceCurrCountry, targetCurrCountry);
    }

    private double checkRate(String sourceCurrCountry, String targetCurrCountry) {
        // get rate from api
        ExchangeApiResponse exchangeApiResponse = getExchangeRates(sourceCurrCountry);
        System.out.println(exchangeApiResponse);
        double targetRate =  exchangeApiResponse.getConversion_rates().get(targetCurrCountry);
        HashMap<String, Double> rates = new HashMap<String, Double>();
        rates.put(targetCurrCountry, targetRate);
        CurrData curr = new CurrData(sourceCurrCountry, rates);
        return curr.getRates().get(targetCurrCountry);
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
