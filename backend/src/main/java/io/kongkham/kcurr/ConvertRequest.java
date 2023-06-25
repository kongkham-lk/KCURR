package io.kongkham.kcurr;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConvertRequest {
    // validate amount to greater than 0
    private double amount;
    // validate both currency type
    private String sourceCurr;
    private String targetCurr;
}
