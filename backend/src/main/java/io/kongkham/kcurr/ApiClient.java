package io.kongkham.kcurr;

public interface ApiClient {
    CurrencyBeaconExchangeRateApiResponse getLatestExchangeRates(String baseCurr);
    CurrencyBeaconExchangeRateApiResponse getHistExchangeRates(String baseCurr);
    CurrencyBeaconCountriesApiResponse[] getCurrCountries();
}
