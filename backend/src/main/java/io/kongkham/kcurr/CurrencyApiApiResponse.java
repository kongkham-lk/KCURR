package io.kongkham.kcurr;

import lombok.Data;

import java.util.HashMap;

@Data
public class CurrencyApiApiResponse {
    private HashMap<String, CurrencyApiApiResponseData> data;
}