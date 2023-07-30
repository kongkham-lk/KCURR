package io.kongkham.kcurr;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RateTimeSeriesResponse {
    private String[] timeSeriesRange;
    private double[] changingRates;
    private double highest;
    private double lowest;
}
