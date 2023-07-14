package io.kongkham.kcurr;

import lombok.Data;

@Data
public class ApiBcdApiResponse {
    private String isoAlpha2;
    private String isoAlpha3;
    private int m49Code;
    private String name;
    private String isoName;
    private String isoNameFull;
    private ApiBcdApiResIsoAdminLanguages[] isoAdminLanguages;
    private String unRegion;
    private ApiBcdApiResponseCurrency currency;
    private ApiBcdApiResponseWbRegion wbRegion;
    private ApiBcdApiResponseWbIncomeLevel wbIncomeLevel;
    private String callingCode;
    private String countryFlagEmoji;
    private String wikidataId;
    private Long geonameId;
}
