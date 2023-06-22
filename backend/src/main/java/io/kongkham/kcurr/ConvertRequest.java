package io.kongkham.kcurr;

import lombok.Data;

@Data
public class ConvertRequest {
    public double amount;
    public String sourceCurr;
    public String targetCurr;

}
