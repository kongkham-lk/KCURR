package io.kongkham.kcurr;

import lombok.Data;

import java.util.HashMap;

@Data
public class CurrencyBeaconExchangeRateApiResponse {
    private String date;
    private String base;
    private HashMap<String, Double> rates;
}
