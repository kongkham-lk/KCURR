package io.kongkham.kcurr;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

@RestController
public class CurrController {

    private final CurrService _currService;

    // is it a way to create CurrService class object?
    public CurrController(CurrService currService) {
        this._currService = currService;
    }

    @PostMapping("/convert") // how @RequestBody pass those 3 values and store to the ConvertRequest instantiate
    public double convertCurr(@RequestBody ConvertRequest data) { // @RequestBody can serve only 1 argument (no duplicated use)
        double amount = data.getAmount();
        String c1 = data.getSourceCurr();
        String c2 = data.getTargetCurr();
        return _currService.convert(amount, c1, c2);
    }
}