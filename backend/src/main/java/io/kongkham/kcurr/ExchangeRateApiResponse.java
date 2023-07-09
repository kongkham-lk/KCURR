package io.kongkham.kcurr;

import lombok.Data;

@Data
public class ExchangeRateApiResponse {
    private ExchangeRateApiResponseMeta meta;
    private ExchangeRateApiResponseRes response;
}
