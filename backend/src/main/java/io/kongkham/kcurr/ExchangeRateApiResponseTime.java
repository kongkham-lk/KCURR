package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ExchangeRateApiResponseTime {
    @JsonProperty("last_updated_at")
    private String lastUpdatedAt;
}
