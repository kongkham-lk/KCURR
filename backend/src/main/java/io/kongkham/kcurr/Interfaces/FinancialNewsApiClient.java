package io.kongkham.kcurr.Interfaces;

import io.kongkham.kcurr.Models.FinancialNewsResponse;

public interface FinancialNewsApiClient {
    public FinancialNewsResponse[] getFinancialNews();
}
