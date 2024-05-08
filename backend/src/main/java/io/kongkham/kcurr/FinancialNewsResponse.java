package io.kongkham.kcurr;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FinancialNewsResponse {
    private String title;
    private String link;
    private String publisher;
    private String publishTime;
    private String thumbnail;
}
