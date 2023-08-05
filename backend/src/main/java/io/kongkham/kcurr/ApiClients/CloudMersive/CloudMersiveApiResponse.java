package io.kongkham.kcurr.ApiClients.CloudMersive;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CloudMersiveApiResponse {
    @JsonProperty("Currencies")
    private CloudMersiveApiResponseCurrencies[] currencies;
}
