package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CurrencyBeaconCurrCountriesApiResponse {
    @JsonProperty("response")
    private CurrencyBeaconCurrCountriesApiResponseResponse[] response ;
}
