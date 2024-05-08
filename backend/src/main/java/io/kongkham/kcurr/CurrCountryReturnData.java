package io.kongkham.kcurr;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CurrCountryReturnData {
    private String currCode;
    private String name;
    private String display;
    private String symbol;
}