export type ConversionData = {
    amount: number;
    baseCurr: string;
    targetCurr: string;
    total: number;
};

export type ConvertorProps = DisplayFlags & User & {
    currCountiesCodeMapDetail: CurrCountiesCodeMapDetail;
    sortedCurrsCodeList: string[];
    validCurFlagList: string[];
    isChartFeatureEnable: boolean;
};

export type CurrCountiesCodeMapDetail = Record<string, CurrCountriesDetail>;

export type CurrCountriesDetail = {
    countryName: string;
    currCode: string;
    currSymbol: string;
    display: string;
    flagCode: string;
};

export type CurrExchangeRates = Record<string, number>;

export type CurrList = {
    change?: string;
    histRate?: number;
    latestRate: number;
    targetCurr: string;
    timeSeries?: TimeSerie;
};

export type DisplayFlags = {
    isDisplaySM: boolean;
    isDisplayMD: boolean;
};

export type NavBarProps = DisplayFlags & User & {
    currentUrl: string;
    isOutLineTheme: boolean;
};

export type Preference = {
    theme?: string;
    convertedCurrPair?: string[];
    liveRateCurrCodes?: string[];
    newsCategories?: string[];
};

export type TimeSerie = {
    changingRates: number[];
    highest: number;
    lowest: number;
    dayRangeIndicator: string[];
    monthRangeIndicator: string[];
};

export type User = {
    userId: string;
    userPreference: Preference;
    onThemeUpdate: () => Promise<void>;
};

export type ChartProps = ConvertorProps & {
    initialCurrLists: CurrList[];
    initialCurrExchangeRates: string[];
    isCurrListReady: boolean;
}

export type NewsProps = DisplayFlags & User & {
    currentUrl: string;
    newsListsRes: string[];
}