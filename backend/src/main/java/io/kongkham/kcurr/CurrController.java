package io.kongkham.kcurr;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/curr")
public class CurrController {
    private final CurrService _currService;

    // is it a way to create CurrService class object?
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

//    @PostMapping("/rate-latest") // how @RequestBody pass those 3 values and store to the ConvertRequest instantiate
//    public ExchangeRateApiResponse getLatestExchangeRates(@RequestBody RateTableRequest data) {
//        String baseCurr = data.getBaseCurr();
//        return _currService.getLatestExchangeRates(baseCurr);
//    }

    @PostMapping("/rate") // how @RequestBody pass those 3 values and store to the ConvertRequest instantiate
    public ExchangeRateApiResponse getExchangeRates(@RequestBody RateTableRequest data) {
        String baseCurr = data.getBaseCurr();
        String dataSet = data.getRateDataSet();
        return _currService.getExchangeRates(baseCurr, dataSet);
    }

    @GetMapping("/currency-country")
    public HashMap<String, CurrCountriesDetailApiResponse> getCurrOption() {
        return _currService.getCurrCountries().getData();
    }

}