package io.kongkham.kcurr.ApiClients.CurrencyApi;

import lombok.Data;

import java.util.HashMap;

@Data
public class CurrencyApiApiResponse {
    private HashMap<String, CurrencyApiApiResponseData> data;
}