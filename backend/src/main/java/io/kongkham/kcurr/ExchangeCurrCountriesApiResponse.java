package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ExchangeCurrCountriesApiResponse extends ExchangeRateApiResponse{
    @JsonProperty("supported_codes")
    private String[][] supportedCodes;
}
