package io.kongkham.kcurr.ApiClients.CurrencyBeacon;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CurrencyBeaconCurrCountriesApiResponse {
    @JsonProperty("response")
    private CurrencyBeaconCurrCountriesApiResponseResponse[] response ;
}
