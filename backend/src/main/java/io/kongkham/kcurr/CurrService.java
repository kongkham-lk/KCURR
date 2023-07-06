package io.kongkham.kcurr;

import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class CurrService {

    private final ExchangeRateApiClient _ExchangeRateApiClient;


    public CurrService(ExchangeRateApiClient exchangeRateApiClient) {
        this._ExchangeRateApiClient = exchangeRateApiClient;
    }

    public double convert(double amount, String sourceCurrCountry, String targetCurrCountry) {
        return amount * checkRate(sourceCurrCountry, targetCurrCountry);
    }

    private double checkRate(String baseCurrCountry, String targetCurrCountry) {
        // get rate from api
        ExchangeRateApiResponse exchangeRateApiResponse = _ExchangeRateApiClient.getExchangeRatesLatest(baseCurrCountry);
        double targetRate =  exchangeRateApiResponse.getConversion_rates().get(targetCurrCountry);
        HashMap<String, Double> rates = new HashMap<String, Double>();
        rates.put(targetCurrCountry, targetRate);
        CurrData curr = new CurrData(baseCurrCountry, rates);
        return curr.getRates().get(targetCurrCountry);
    }

    public ExchangeRateApiResponse getExchangeRate(String baseCurr, String dataSet) {
        if (dataSet.equals("lastest")) {
            return _ExchangeRateApiClient.getExchangeRatesLatest(baseCurr);
        } else {
            return _ExchangeRateApiClient.getExchangeRatesHist(baseCurr);
        }
    }

    public ExchangeRateApiResponse getCurrCountry() {
        return _ExchangeRateApiClient.getCurrCountry();
    }
}
