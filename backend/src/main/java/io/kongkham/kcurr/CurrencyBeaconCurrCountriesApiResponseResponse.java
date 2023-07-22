package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CurrencyBeaconCurrCountriesApiResponseResponse {
    @JsonProperty("name")
    private String currNameWithCountryName;
    @JsonProperty("short_code")
    private String currCode;
    @JsonProperty("symbol")
    private String currSymbol;
}
