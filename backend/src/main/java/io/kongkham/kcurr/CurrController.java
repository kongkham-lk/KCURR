package io.kongkham.kcurr;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/curr")
public class CurrController {
    private final CurrService _currService;

    public CurrController(CurrService _currService) {
        this._currService = _currService;
    }

    @PostMapping("/convert") // how @RequestBody pass those 3 values and store to the ConvertRequest instantiate
    public double getConvertCurr(@RequestBody ConvertRequest data) { // @RequestBody can serve only 1 argument (no duplicated use)
        double amount = data.getAmount();
        String baseCurr = data.getBaseCurr();
        String targetCurr = data.getTargetCurr();
        return _currService.convert(amount, baseCurr, targetCurr);
    }

    @PostMapping("/rate") // how @RequestBody pass those 3 values and store to the ConvertRequest instantiate
    public ExchangeRateApiResponse getExchangeRatesHist(@RequestBody RateTableRequest data) {
        String baseCurr = data.getBaseCurr();
        String dataSet = data.getRateDataSet();
        return _currService.getExchangeRate(baseCurr, dataSet);
    }

    @GetMapping("/currency-country")
    public ExchangeCurrCountriesApiResponse getCurrOption() {
        return _currService.getCurrCountry();
    }

}