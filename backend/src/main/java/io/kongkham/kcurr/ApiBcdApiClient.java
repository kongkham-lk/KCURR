package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;

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

    public HashMap<String, String> getCountriesCodeAbbrPair() {
        ApiBcdApiResponse[] countriesDetailRes = getCountriesData();
        HashMap<String, String> codeAbbrPair = new HashMap<String, String>();
        HashMap<String, Integer> existCurr = new HashMap<String, Integer>();
        for (int i = 0; i < countriesDetailRes.length; i++) {
            ApiBcdApiResponse countryDetail = countriesDetailRes[i];
            String currCode = countryDetail.getCurrency().getCode();
            String abbr;
            if (existCurr.containsKey(currCode)) {
                abbr = currCode;
            } else {
                existCurr.put(currCode, 0);
                abbr = countryDetail.getIsoAlpha2();
            }
            codeAbbrPair.put(currCode, abbr);
        }
        return codeAbbrPair;
    }
}
