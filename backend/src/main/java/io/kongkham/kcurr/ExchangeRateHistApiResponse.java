package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.HashMap;
@Data
public class ExchangeRateHistApiResponse extends ExchangeRateApiResponse {
    private int year;
    private int month;
    private int day;
    @JsonProperty("base_code")
    private String baseCode;
    @JsonProperty("conversion_rates")
    private HashMap<String, Double> conversionRates;
}
