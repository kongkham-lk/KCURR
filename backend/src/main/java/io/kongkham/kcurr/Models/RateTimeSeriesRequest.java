package io.kongkham.kcurr.Models;

import lombok.Data;

@Data
public class RateTimeSeriesRequest {
    private String baseCurr;
    private String targetCurr;
    private String timeSeriesRange;
}
