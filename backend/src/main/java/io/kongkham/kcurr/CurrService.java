package io.kongkham.kcurr;

import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class CurrService {

    private final ExchangeRatesGetter _ExchangeRatesGetter;

    public CurrService(ExchangeRatesGetter exchangeRatesGetter) {
        this._ExchangeRatesGetter = exchangeRatesGetter;
    }

    public double convert(double amount, String sourceCurrCountry, String targetCurrCountry) {
        return amount * checkRate(sourceCurrCountry, targetCurrCountry);
    }

    private double checkRate(String baseCurrCountry, String targetCurrCountry) {
        // get rate from api
        ExchangeApiResponse exchangeApiResponse = _ExchangeRatesGetter.getExchangeRates(baseCurrCountry);
        double targetRate =  exchangeApiResponse.getConversion_rates().get(targetCurrCountry);
        HashMap<String, Double> rates = new HashMap<String, Double>();
        rates.put(targetCurrCountry, targetRate);
        CurrData curr = new CurrData(baseCurrCountry, rates);
        return curr.getRates().get(targetCurrCountry);
    }

}
