package io.kongkham.kcurr;

import lombok.Data;

@Data
public class ConvertRequest {
    // validate amount to greater than 0
    private double amount;
    // validate both currency type
    private String sourceCurr;
    private String targetCurr;

    public ConvertRequest(double amount, String sourceCurr, String targetCurr) {
        this.amount = amount;
        this.sourceCurr = sourceCurr;
        this.targetCurr = targetCurr;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
    public void setCurr(String sourceCurr, String targetCurr) {
        this.sourceCurr = sourceCurr;
        this.targetCurr = targetCurr;
    }
    public double getAmount() {
        return this.amount;
    }
    public String getCurr() {
        return this.sourceCurr + " to " + this.targetCurr;
    }

    public double convert() {
        return amount * checkRate(sourceCurr) / checkRate(targetCurr);
    }

    public double convert(double amount, String sourceCurr, String targetCurr) {
        return amount * checkRate(sourceCurr) / checkRate(targetCurr);
    }

    private double checkRate(String curr) {
        // get rate from api
        double rate;
        return 0;
    }

    public String toString() {
        return "Amount: " + amount + ", from: " + sourceCurr + ", to: " + targetCurr;
    }
}
