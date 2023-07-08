package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.HashMap;

@Data
public class ExchangeRateLatestApiResponse extends ExchangeRateApiResponse {
    @JsonProperty("time_last_update_unix")
    private long timeLastUpdateUnix;
    @JsonProperty("time_last_update_utc")
    private String timeLastUpdateUtc;
    @JsonProperty("time_next_update_unix")
    private long timeNextUpdateUnix;
    @JsonProperty("time_next_update_utc")
    private String timeNextUpdateUtc;
    @JsonProperty("base_code")
    private String baseCode;
    @JsonProperty("conversion_rates")
    private HashMap<String, Double> conversionRates;
}
