package io.kongkham.kcurr.Controllers;

import io.kongkham.kcurr.Models.FinancialNewsResponse;
import io.kongkham.kcurr.Services.FinancialNewsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FinancialNewsController {
    private final FinancialNewsService _financialNewsService;

    public FinancialNewsController(FinancialNewsService financialNewsService) {
        this._financialNewsService = financialNewsService;
    }

    @GetMapping("/news")
    public FinancialNewsResponse[] getFinancialNews() {
        return _financialNewsService.getFinancialNews();
    }
}
