package io.kongkham.kcurr;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

@RestController
public class CurrController {

    private final CurrService _currService;

    public CurrController(CurrService currService) {
        this._currService = currService;
    }
    @PostMapping("/convert") // how @RequestBody pass those 3 values and store to the ConvertRequest instantiate
    public ExchangeApiResponse convertCurr(@RequestBody ConvertRequest data) { // @RequestBody can serve only 1 argument (no duplicated use)
//        CurrService currService = new CurrService();
//        double amount = data.getAmount();
//        String c1 = data.getSourceCurr();
//        String c2 = data.getTargetCurr();
//        return currService.convert(amount, c1, c2);
        return _currService.getExchangeRates("USD");
    }
}