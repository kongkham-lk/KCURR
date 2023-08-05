package io.kongkham.kcurr.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CurrCountriesResponse {
    private String currCode;
    private String countryName;
    private String display;
    private String currSymbol;
    private String flagCode;
}
