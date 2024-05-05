package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;

@Service
public class ExchangeRateApiClient {
    private final WebClient _webClient;

    @Value("${currencybeacon.api.app-id}")
    private String _exchangeRateApiKey;
    @Value("${currencyApi.api.app-id}")
    private String _currCountriesApiKey;

    public ExchangeRateApiClient(WebClient.Builder webClientBuilder) {
        this._webClient = webClientBuilder.build();
    }

    public ExchangeRateApiResponse getLatestExchangeRates(String baseCurr) {
        String url = "https://api.currencybeacon.com/v1/latest?api_key=" + _exchangeRateApiKey + "&base=" + baseCurr;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ExchangeRateApiResponse.class)
                .block();
    }
//    https://api.currencybeacon.com/v1/historical?api_key=a345103ffbb84fc88701a6dc6d5dc2a5&date=2023-07-07&base=USD
    public ExchangeRateApiResponse getHistExchangeRates(String baseCurr) {
        LocalDate today = LocalDate.now();  // get the current date
        LocalDate yesterday = today.plusDays(-1);  // subtract 1 day
        String url = "https://api.currencybeacon.com/v1/historical?api_key=" + _exchangeRateApiKey + "&base=" + baseCurr + "&date=" + yesterday;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(ExchangeRateApiResponse.class)
                .block();
    }

    //    https://api.currencyapi.com/v3/currencies?apikey=mTpCtGS5p6bjOfOPgKruw1aMyF0QKuL04fpxvbvQ
    public CurrCountriesApiResponse getCurrCountries() {
        String url = "https://api.currencyapi.com/v3/currencies?apikey=" + _currCountriesApiKey;
        return _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrCountriesApiResponse.class)
                .block();
    }
}
