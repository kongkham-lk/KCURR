package io.kongkham.kcurr;

import org.json.JSONObject;

import java.util.HashMap;

public class CurrService {
    public CurrService() {

    }

    public double convert(double amount, String sourceCurr, String targetCurr) {
        return amount * checkRate(sourceCurr, targetCurr);
    }

    private double checkRate(String sourceCurr, String targetCurr) {
        // get rate from api
        CurrApiController currApiController = new CurrApiController();
        String exchangeRates = currApiController.getExchangeRates(sourceCurr);


        JSONObject rateJSON = new JSONObject(exchangeRates);
        // how to access the value of hashmap of another hashmap => rateObject.conversion_rates.TARGET_CURR
        System.out.println("rateObject => \n" + rateJSON);

        HashMap<String, Double> rates = new HashMap<String, Double>();
        rates.put(targetCurr, 35.32);
        CurrData curr = new CurrData(sourceCurr, rates);
        return curr.getRates().get(targetCurr);
    }
}
