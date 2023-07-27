package io.kongkham.kcurr;

import lombok.Data;

import java.util.HashMap;

@Data
public class CurrencyBeaconTimeSeriesApiResponse {
    private HashMap<String, HashMap<String, Double>> response;
}
