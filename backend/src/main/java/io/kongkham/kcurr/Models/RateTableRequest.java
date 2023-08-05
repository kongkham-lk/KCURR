package io.kongkham.kcurr.Models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RateTableRequest {
    private String baseCurr;
    private String rateDataSet;
}
