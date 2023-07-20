package io.kongkham.kcurr;

import lombok.Data;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Data
public class CurrencyApiApiResponse {
    private HashMap<String, CurrencyApiApiResponseData> data;
}