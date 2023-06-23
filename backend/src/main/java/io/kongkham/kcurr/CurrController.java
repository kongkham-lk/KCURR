package io.kongkham.kcurr;

import org.springframework.web.bind.annotation.*;

@RestController
public class CurrController {
    @PostMapping("/convert") // how @RequestBody pass those 3 values and store to the ConvertRequest instantiate
    public double convertCurr(@RequestBody ConvertRequest data) { // @RequestBody can serve only 1 argument (no duplicated use)
        // validate if amount to is greater than 0
        // validate if currency type is valid
        // FOUND HOW TO VALIDATE BUT DON KNOW HOW TO ADD DEPENDENCY TO build.gradle
        return data.convert();
    }
}