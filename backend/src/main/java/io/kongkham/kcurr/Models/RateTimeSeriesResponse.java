package io.kongkham.kcurr.Models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RateTimeSeriesResponse {
    private String[] dayRangeIndicator;
    private String[] monthRangeIndicator;
    private double[] changingRates;
    private double highest;
    private double lowest;
}
