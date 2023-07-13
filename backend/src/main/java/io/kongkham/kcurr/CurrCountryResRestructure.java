package io.kongkham.kcurr;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CurrCountryResRestructure {
    private String currCode;
//    private String countryCode;
    private String name;
    private String display;
    private String symbol;
}
