package io.kongkham.kcurr.Controllers;

import io.kongkham.kcurr.Models.FinancialNewsRequest;
import io.kongkham.kcurr.Models.FinancialNewsResponse;
import io.kongkham.kcurr.Services.FinancialNewsService;
import org.springframework.web.bind.annotation.*;

@RestController
public class FinancialNewsController {
    private final FinancialNewsService _financialNewsService;

    public FinancialNewsController(FinancialNewsService financialNewsService) {
        this._financialNewsService = financialNewsService;
    }

    @PostMapping("/news")
    public FinancialNewsResponse[] getFinancialNews(@RequestBody FinancialNewsRequest data) {
        String newsTopic = data.getNewsTopic();
        return _financialNewsService.getFinancialNews(newsTopic);
    }
}
