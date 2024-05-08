package io.kongkham.kcurr;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import lombok.Data;

@Data
public class RapidApiApiResponseNews {
    private String title;
    private String publisher;
    private String link;
    @JsonProperty("providerPublishTime")
    private long publishTime;
    @Nullable
    private RapidApiApiResponseThumbnail thumbnail;

    public String getThumbnail() {
        return thumbnail.getResolutions()[0].getUrl();
    }
}
