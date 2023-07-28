package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service("CurrencyBeacon")
public class CurrencyBeaconApiClient implements ExchangeRateApiClient {
    private final WebClient _webClient;

    @Value("${currencyBeacon.api.app-id}")
    private String _currencyBeaconApiKey;

    public CurrencyBeaconApiClient(WebClient.Builder webClientBuilder) {
        this._webClient = webClientBuilder.build();
    }

    public HashMap<String, Double> getLatestExchangeRates(String baseCurr) {
        String url = "https://api.currencybeacon.com/v1/latest?api_key=" + _currencyBeaconApiKey + "&base=" + baseCurr;
        CurrencyBeaconExchangeRateApiResponse exchangeRateApiResponse = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconExchangeRateApiResponse.class)
                .block();
        return exchangeRateApiResponse.getResponse().getRates();
    }

    public HashMap<String, Double> getHistoricalExchangeRates(String baseCurr) {
        LocalDate today = LocalDate.now();  // get the current date
        LocalDate yesterday = today.plusDays(-1);  // subtract 1 day
        String url = "https://api.currencybeacon.com/v1/historical?api_key=" + _currencyBeaconApiKey + "&base=" + baseCurr + "&date=" + yesterday;
        CurrencyBeaconExchangeRateApiResponse exchangeRateApiResponse = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconExchangeRateApiResponse.class)
                .block();
        return exchangeRateApiResponse.getResponse().getRates();
    }

    public HashMap<String, CurrCountriesReturnData> getCurrCountries() {
        String url = "https://api.currencybeacon.com/v1/currencies?api_key=" + _currencyBeaconApiKey;
        CurrencyBeaconCurrCountriesApiResponse currCountriesRes = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconCurrCountriesApiResponse.class)
                .block();
        HashMap<String, CurrCountriesReturnData> currCountries = transformedCurrCountriesResData(currCountriesRes);
        return currCountries;
    }

    private HashMap<String, CurrCountriesReturnData> transformedCurrCountriesResData(CurrencyBeaconCurrCountriesApiResponse currCountriesRes) {
        CurrencyBeaconCurrCountriesApiResponseResponse[] data = currCountriesRes.getResponse();
        HashMap<String, CurrCountriesReturnData> currCountries = new HashMap<String, CurrCountriesReturnData>();
        for (int i = 0; i < data.length; i++) {
            CurrencyBeaconCurrCountriesApiResponseResponse currCountryDetail = data[i];
            String key = currCountryDetail.getCurrCode();
            String currCode = key;
            String countryCurrName = currCountryDetail.getCurrNameWithCountryName();
            String display = currCode + " - " + countryCurrName;
            String currSymbol = currCountryDetail.getCurrSymbol();
            String flagCode = currCode.substring(0, 2);
            CurrCountriesReturnData val = new CurrCountriesReturnData(currCode, countryCurrName, display, currSymbol, flagCode);
            currCountries.put(key, val);
        }
        return currCountries;
    }

    public HashMap<String, Double> getExchangeRatesWeekTimeSeries(String baseCurr, String targetCurr) {
        LocalDate endDate = LocalDate.now();  // get the current date
        LocalDate startDate  = endDate.plusDays(-6);  // subtract 1 day
        String url = "https://api.currencybeacon.com/v1/timeseries?api_key=" + _currencyBeaconApiKey + "&start_date=" + startDate + "&end_date=" + endDate + "&base=" + baseCurr + "&symbols=" + targetCurr;
        CurrencyBeaconTimeSeriesApiResponse exchangeRateApiResponse = _webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(CurrencyBeaconTimeSeriesApiResponse.class)
                .block();
        HashMap<String, Double> rateTimeSeries = transformedTimeSeriesResData(exchangeRateApiResponse, targetCurr);
        return rateTimeSeries;
    }

    private HashMap<String, Double> transformedTimeSeriesResData(CurrencyBeaconTimeSeriesApiResponse exchangeRateApiResponse, String targetCurr) {
        HashMap<String, HashMap<String, Double>> data = exchangeRateApiResponse.getResponse();
        HashMap<String, Double> timeSeries = new HashMap<String, Double>();
        for (Map.Entry<String,HashMap<String, Double>> element : data.entrySet()) {
            String date = element.getKey();
            Double rate = element.getValue().get(targetCurr);
            timeSeries.put(date, rate);
        }
        return timeSeries;
    }
}
