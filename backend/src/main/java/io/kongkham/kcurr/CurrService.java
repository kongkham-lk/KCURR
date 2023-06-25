package io.kongkham.kcurr;

import java.util.HashMap;
import java.util.Map;

public class CurrService {
    public CurrService() {

    }

    public double convert(double amount, String sourceCurr, String targetCurr) {
        return amount * checkRate(sourceCurr, targetCurr);
    }

    private double checkRate(String sourceCurr, String targetCurr) {
        // get rate from api
        HashMap<String, Double> rates = new HashMap<String, Double>();
        rates.put(targetCurr, 35.32);
        CurrData curr = new CurrData(sourceCurr, rates);
        return curr.getRates().get(targetCurr);
    }
}
