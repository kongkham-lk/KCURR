package io.kongkham.kcurr;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

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

    @PostMapping("/rate-latest") // how @RequestBody pass those 3 values and store to the ConvertRequest instantiate
    public HashMap<String, Double> getLatestExchangeRates(@RequestBody RateTableRequest data) {
        String baseCurr = data.getBaseCurr();
        HashMap<String, Double> result = _currService.getLatestExchangeRates(baseCurr);
        return result;
    }

    @PostMapping("/rate-hist") // how @RequestBody pass those 3 values and store to the ConvertRequest instantiate
    public HashMap<String, Double> getExchangeRates(@RequestBody RateTableRequest data) {
        String baseCurr = data.getBaseCurr();
        HashMap<String, Double> result = _currService.getHistExchangeRates(baseCurr);
        return result;
    }

    @GetMapping("/currency-country")
    public HashMap<String, CurrCountryResRestructure> getCurrOption() {
        return _currService.getCurrCountries();
    }
}