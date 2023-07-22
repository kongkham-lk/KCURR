package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.HashMap;

@Service("CurrencyBeacon")
public class CurrencyBeaconApiClient implements ExchangeRateApiClient {
    private final WebClient _webClient;

    @Value("${currencyBeacon.api.app-id}")
    private String _currencyBeaconApiKey;

    public CurrencyBeaconApiClient(WebClient.Builder webClientBuilder) {
        this._webClient = webClientBuilder.build();
    }

    public Mono<HashMap<String, Double>> getLatestExchangeRates(String baseCurr) {
        String url = "https://api.currencybeacon.com/v1/latest?api_key=" + _currencyBeaconApiKey + "&base=" + baseCurr;
        CurrencyBeaconExchangeRateApiResponse exchangeRateApiResponse = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconExchangeRateApiResponse.class)
                .block();
        return Mono.just(exchangeRateApiResponse.getResponse().getRates());
    }

    public Mono<HashMap<String, Double>> getHistoricalExchangeRates(String baseCurr) {
        LocalDate today = LocalDate.now();  // get the current date
        LocalDate yesterday = today.plusDays(-1);  // subtract 1 day
        String url = "https://api.currencybeacon.com/v1/historical?api_key=" + _currencyBeaconApiKey + "&base=" + baseCurr + "&date=" + yesterday;
        CurrencyBeaconExchangeRateApiResponse exchangeRateApiResponse = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconExchangeRateApiResponse.class)
                .block();
        return Mono.just(exchangeRateApiResponse.getResponse().getRates());
    }

    public Mono<HashMap<String, CurrCountryReturnData>> getCurrCountries() {
        String url = "https://api.currencybeacon.com/v1/currencies?api_key=" + _currencyBeaconApiKey;
        CurrencyBeaconCurrCountriesApiResponse currCountriesRes = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconCurrCountriesApiResponse.class)
                .block();
        HashMap<String, CurrCountryReturnData> currCountries = transformedJsonData(currCountriesRes);
        return Mono.just(currCountries);
    }

    private HashMap<String, CurrCountryReturnData> transformedJsonData(CurrencyBeaconCurrCountriesApiResponse currCountriesRes) {
        CurrencyBeaconCurrCountriesApiResponseResponse[] data = currCountriesRes.getResponse();
        HashMap<String, CurrCountryReturnData> currCountries = new HashMap<String, CurrCountryReturnData>();
        for (int i = 0; i < data.length; i++) {
            CurrencyBeaconCurrCountriesApiResponseResponse currCountryDetail = data[i];
            String key = currCountryDetail.getCurrCode();
            String currCode = key;
            String countryCurrName = currCountryDetail.getCurrNameWithCountryName();
            String display = currCode + " - " + countryCurrName;
            String currSymbol = currCountryDetail.getCurrSymbol();
            String flagCode = currCode.substring(0, 2);
            CurrCountryReturnData val = new CurrCountryReturnData(currCode, countryCurrName, display, currSymbol, flagCode);
            currCountries.put(key, val);
        }
        return currCountries;
    }
}
