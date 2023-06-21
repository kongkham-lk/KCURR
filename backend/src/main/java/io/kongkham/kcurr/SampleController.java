package io.kongkham.kcurr;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SampleController {
    @GetMapping("/hello")
    public String GetHelloWorld() {
        return "Hello world";
    }
}