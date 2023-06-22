package io.kongkham.kcurr;

import org.springframework.web.bind.annotation.*;

@RestController
public class CurrController {
    @PostMapping("/convert")
    public double convertCurr(@RequestBody ConvertRequest data) {
        return 5.5;
    }
}