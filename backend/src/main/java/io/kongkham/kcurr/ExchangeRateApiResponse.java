package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import lombok.Data;

import java.util.HashMap;
@Data
public class ExchangeRateApiResponse {
    private String result;
    private String documentation;
    private String terms_of_use;

    // for latest dataset endpoint
    @Nullable
    @JsonProperty("time_last_update_unix")
    private long timeLastUpdateUnix;
    @Nullable
    @JsonProperty("time_last_update_utc")
    private String timeLastUpdateUtc;
    @Nullable
    @JsonProperty("time_next_update_unix")
    private long timeNextUpdateUnix;
    @Nullable
    @JsonProperty("time_next_update_utc")
    private String timeNextUpdateUtc;

    // for historical dataset endpoint
    @Nullable
    private int year;
    @Nullable
    private int month;
    @Nullable
    private int day;
    private String base_code;
    @Nullable
    private HashMap<String, Double> conversion_rates;

    // currency countries dataset endpoint
    @Nullable
    private String[][] supported_codes;
}
