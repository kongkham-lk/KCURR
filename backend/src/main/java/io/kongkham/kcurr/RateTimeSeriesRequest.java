package io.kongkham.kcurr;

import lombok.Data;

@Data
public class RateTimeSeriesRequest {
    private String baseCurr;
    private String targetCurr;
    private String timeSeriesRange;
}
