package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CloudMersiveApiResponseCurrencies {
    @JsonProperty("ISOCurrencyCode")
    private String currCode;
    @JsonProperty("CurrencySymbol")
    private String currSymbol;
    @JsonProperty("CurrencyEnglishName")
    private String CurrName;
    private String CountryName;
    @JsonProperty("CountryISOTwoLetterCode")
    private String currFlagTwoLetterCode;
}
