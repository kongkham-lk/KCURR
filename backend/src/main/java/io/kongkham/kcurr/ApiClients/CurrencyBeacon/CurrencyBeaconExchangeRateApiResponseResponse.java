package io.kongkham.kcurr.ApiClients.CurrencyBeacon;

import lombok.Data;

import java.util.HashMap;

@Data
public class CurrencyBeaconExchangeRateApiResponseResponse {
    private String date;
    private String base;
    private HashMap<String, Double> rates;
}
