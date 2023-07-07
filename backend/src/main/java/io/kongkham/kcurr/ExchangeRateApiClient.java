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

    public ExchangeRateApiResponse getLatestExchangeRates(String baseCurr) {
        LocalDate today = LocalDate.now();  // get the current date
        String url = "https://api.currencyapi.com/v3/historical?date=" + today + "&apikey=" + _apiKey + "&base_currency=" + baseCurr;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ExchangeRateApiResponse.class)
                .block();
    }
//    https://api.currencyapi.com/v3/historical?date=2022-01-01&apikey=mTpCtGS5p6bjOfOPgKruw1aMyF0QKuL04fpxvbvQ&base_currency=THB
    public ExchangeRateApiResponse getHistExchangeRates(String baseCurr) {
        LocalDate today = LocalDate.now();  // get the current date
        LocalDate yesterday= today.plusDays(-1);  // subtract 1 day
        String url = "https://api.currencyapi.com/v3/historical?date=" + yesterday + "&apikey=" + _apiKey + "&base_currency="+ baseCurr;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ExchangeRateApiResponse.class)
                .block();
    }
//    https://api.currencyapi.com/v3/currencies?apikey=mTpCtGS5p6bjOfOPgKruw1aMyF0QKuL04fpxvbvQ
    public CurrCountriesApiResponse getCurrCountries() {
        String url = "https://api.currencyapi.com/v3/currencies?apikey=" + _apiKey;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrCountriesApiResponse.class)
                .block();
    }
}
