package io.kongkham.kcurr;

import lombok.Data;

import java.util.HashMap;

@Data
public class ExchangeRateApiResponse {
    private ExchangeRateApiResponseTime meta;
    private HashMap<String, ExchangeRateApiResponseData> data;
}
