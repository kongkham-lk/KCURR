package io.kongkham.kcurr;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrCountryReturnData {
    private String currCode;
    private String countryName;
    private String display;
    private String currSymbol;
    private String flagCode;
}
