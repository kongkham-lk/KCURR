package io.kongkham.kcurr;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class CurrData {
//    private boolean success;
    private String base;
    private Map<String, Double> rates;
}
