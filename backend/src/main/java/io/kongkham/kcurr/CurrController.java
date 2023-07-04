package io.kongkham.kcurr;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;

@RestController
public class CurrController {
    private final CurrService currService;
    private final WebClient webClient;
    private final ExchangeRatesGetter exchangeRatesGetter;

    @Value("${openexchangerates.api.app-id}")
    private String apiKey;

    // is it a way to create CurrService class object?
    public CurrController(CurrService currService, WebClient.Builder webClientBuilder, ExchangeRatesGetter exchangeRatesGetter) {
        this.currService = currService;
        this.webClient = webClientBuilder.build();
        this.exchangeRatesGetter = exchangeRatesGetter;
    }

    @PostMapping("/convert") // how @RequestBody pass those 3 values and store to the ConvertRequest instantiate
    public double getConvertCurr(@RequestBody ConvertRequest data) { // @RequestBody can serve only 1 argument (no duplicated use)
        double amount = data.getAmount();
        String c1 = data.getSourceCurr();
        String c2 = data.getTargetCurr();
        return currService.convert(amount, c1, c2);
    }

//    @PostMapping("/api/rate") // how @RequestBody pass those 3 values and store to the ConvertRequest instantiate
//    public ExchangeApiResponse getExchangeRateData(@RequestBody RateTableRequest data) { // @RequestBody can serve only 1 argument (no duplicated use)
//        String sourceCurr = data.getSourceCurr();
//        String dataSet = data.getRateDataSet();
//        ExchangeApiResponse rate;
//        if (dataSet.equals("lastest")) {
//            rate = exchangeRatesGetter.getExchangeRates(sourceCurr);
//        } else {
//            rate = exchangeRatesGetter.getExchangeRatesHist(sourceCurr);
//        }
//        return rate;
//    }

    @PostMapping("/api/rate") // how @RequestBody pass those 3 values and store to the ConvertRequest instantiate
    public String getExchangeRatesHist(@RequestBody RateTableRequest data) {
        String sourceCurr = data.getSourceCurr();
        String dataSet = data.getRateDataSet();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        LocalDate time = LocalDate.now();  // get the current date
        String url;
        if (dataSet.equals("lastest")) {
            url = "https://v6.exchangerate-api.com/v6/" + apiKey + "/latest/" + sourceCurr;
        } else {
            time = time.plusDays(-1);  // subtract 1 day
            String formateTime = dtf.format(time);
            url = "https://v6.exchangerate-api.com/v6/" + apiKey + "/history/" + sourceCurr + "/" + formateTime;
        }
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    @GetMapping("/api/exchange-rate")
    public String getCurrOption() {
        String url = "https://v6.exchangerate-api.com/v6/" + apiKey + "/codes";
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

}