package io.kongkham.kcurr;

import lombok.Data;

@Data
public class ApiBcdApiResponseCurrency {
    private int numericCode;
    private String code;
    private String name;
    private int minorUnits;
}
