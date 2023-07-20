package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CurrencyApiApiResponseData {
//    private String symbol;
    private String name;
    @JsonProperty("symbol_native")
    private String symbolNative;
//    @JsonProperty("decimal_digits")
//    private int decimalDigits;
//    private int rounding;
    @JsonProperty("code")
    private String currCode;
//    @JsonProperty("name_plural")
//    private String namePlural;
}
