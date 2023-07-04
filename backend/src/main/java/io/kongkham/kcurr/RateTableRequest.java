package io.kongkham.kcurr;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RateTableRequest {
    private String sourceCurr;
    private String rateDataSet;
}
