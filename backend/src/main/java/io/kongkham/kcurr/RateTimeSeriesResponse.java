package io.kongkham.kcurr;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RateTimeSeriesResponse {
    private String[] dateRange;
    private double[] changingRates;
}
