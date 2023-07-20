package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CurrencyBeaconCountriesApiResponse {
    private String name;
    @JsonProperty("short_code")
    private String currCode;
    private String symbol;
}
