package io.kongkham.kcurr.ApiClients.CurrencyApi;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CurrencyApiApiResponseData {
    @JsonProperty("name")
    private String currNameWithCountryName;
    @JsonProperty("symbol_native")
    private String symbolNative;
    @JsonProperty("code")
    private String currCode;
}
