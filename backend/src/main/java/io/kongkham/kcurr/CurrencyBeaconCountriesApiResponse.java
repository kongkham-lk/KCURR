package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CurrencyBeaconCountriesApiResponse {
    private int id;
    private String name;
    @JsonProperty("short_code")
    private String shortCode;
    private String code;
    private int precision;
    private int subunit;
    private String symbol;
    @JsonProperty("symbol_first")
    private boolean symbolFirst;
    @JsonProperty("decimal_mark")
    private String decimalMark;
    @JsonProperty("thousands_separator")
    private String thousandsSeparator;
}
