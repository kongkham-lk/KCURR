package io.kongkham.kcurr.Services;

import io.kongkham.kcurr.Interfaces.FinancialNewsApiClient;
import io.kongkham.kcurr.Models.FinancialNewsResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FinancialNewsService {
    private final List<FinancialNewsApiClient> _financialNewsApiClient;

    public FinancialNewsService(List<FinancialNewsApiClient> financialNewsApiClient) {
        this._financialNewsApiClient = financialNewsApiClient;
    }

    public FinancialNewsResponse[] getFinancialNews(String newsTopic) {
        FinancialNewsResponse[] news = null;
        for (FinancialNewsApiClient apiClient : _financialNewsApiClient) {
            try {
                news = apiClient.getFinancialNews(newsTopic);
            } catch (Exception e) {
                System.out.println("Cannot retrieve news: " + e);
            }
        }
        return news;
    }
}
