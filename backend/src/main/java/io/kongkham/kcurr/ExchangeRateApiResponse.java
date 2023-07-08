package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import lombok.Data;

import java.util.HashMap;
@Data
public class ExchangeRateApiResponse {
    private String result;
    private String documentation;
    private String terms_of_use;
}
