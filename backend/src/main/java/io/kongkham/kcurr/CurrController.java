package io.kongkham.kcurr;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CurrController {
    @PostMapping("/convert")
    public double convertCurr(@RequestBody ConvertRequest data) {
        return 5;
    }
}