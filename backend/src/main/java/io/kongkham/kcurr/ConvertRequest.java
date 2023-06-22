package io.kongkham.kcurr;

import lombok.Data;

@Data
public class ConvertRequest {
    private double amount;
    private String sourceCurr;
    private String targetCurr;

    public ConvertRequest(double amount, String sourceCurr, String targetCurr) {
        this.amount = amount;
        this.sourceCurr = sourceCurr;
        this.targetCurr = targetCurr;
    }
    public double convert() {
        return amount * checkRate(sourceCurr) / checkRate(targetCurr);
    }

    private double checkRate(String curr) {
        // get rate from api
        double rate;
        return 0;
    }
}
