package io.kongkham.kcurr.ApiClients.RapidApi;

import io.kongkham.kcurr.Interfaces.FinancialNewsApiClient;
import io.kongkham.kcurr.Models.FinancialNewsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.text.SimpleDateFormat;
import java.util.*;

@Service("RapidApi")
public class RapidApiApiClient implements FinancialNewsApiClient {
    final private WebClient _webClient;

    @Value("${rapidApi.api.app-id}")
    private String _rapidApiApiKey;

    public RapidApiApiClient(WebClient.Builder webClientBuidler) {
        this._webClient = webClientBuidler.build();
    }

    public FinancialNewsResponse[] getFinancialNews(String newsTopic) {
        String url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?q=" + newsTopic + "&region=US";
        String hostNews = "apidojo-yahoo-finance-v1.p.rapidapi.com";
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-RapidAPI-Key", _rapidApiApiKey);
        headers.set("X-RapidAPI-Host", hostNews);
        RapidApiApiResponse financialNewsRes = _webClient.get()
                .uri(url)
                .headers(httpHeaders -> httpHeaders.addAll(headers))
                .retrieve()
                .bodyToMono(RapidApiApiResponse.class)
                .block();
        FinancialNewsResponse[] financialNewsList = transformedJsonData(financialNewsRes);
        return financialNewsList;
    }

    private FinancialNewsResponse[] transformedJsonData(RapidApiApiResponse financialNewsRes) {
        RapidApiApiResponseNews[] newsResLists = financialNewsRes.getNews();
        FinancialNewsResponse[] newsLists = new FinancialNewsResponse[newsResLists.length];
        for (int i = 0; i < newsResLists.length; i++) {
            RapidApiApiResponseNews news = newsResLists[i];
            String newsTitle = news.getTitle();
            String newsPublisher = news.getPublisher();
            String newsLink = news.getLink();
            long newsPublishTimeRes = news.getPublishTime();
            String newsPublishTime = formatTimeStructure(newsPublishTimeRes);
            String newsThumbnail;
            try {
                newsThumbnail = news.getThumbnail();
            } catch (Exception e) {
                newsThumbnail = null;
            }
            newsLists[i] = new FinancialNewsResponse(newsTitle, newsLink, newsPublisher, newsPublishTime, newsThumbnail);
        }
        return newsLists;
    }

    private String formatTimeStructure(long newsPublishTimeRes) {
        long millis = newsPublishTimeRes * 1000;
        Date date = new Date(millis);
        SimpleDateFormat formatter = new SimpleDateFormat("EEE, MMM dd, yyyy hh:mm:ss a", Locale.ENGLISH);
        formatter.setTimeZone(TimeZone.getTimeZone("PDT"));
        String formattedDate = formatter.format(date);
        formattedDate = formattedDate.substring(0, formattedDate.length() - 11) + "at" + formattedDate.substring(formattedDate.length() - 12) + " PDT";
        return formattedDate;
    }
}
