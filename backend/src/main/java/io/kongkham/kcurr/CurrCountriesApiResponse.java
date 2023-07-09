package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.HashMap;

@Data
public class CurrCountriesApiResponse {
    private HashMap<String, CurrCountriesDetailApiResponse> data;
}
