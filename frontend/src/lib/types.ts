export type User = {
    userId: string;
    userPreference: Preference;
    onThemeUpdate: () => Promise<void>;
};

export type Preference = {
    theme?: string;
    convertedCurrPair?: string[];
    liveRateCurrCodes?: string[];
    newsCategories?: string[];
};

export type ConversionData = {
    amount: number;
    baseCurr: string;
    targetCurr: string;
    total: number;
};

export type CurrExchangeRates = Record<string, number>;

export type CurrCountiesCodeMapDetail = Record<string, CurrCountriesDetail>;

export type CurrCountriesDetail = {
    countryName: string;
    currCode: string;
    currSymbol: string;
    display: string;
    flagCode: string;
};

export type CurrList = {
    change?: string;
    histRate?: number;
    latestRate: number;
    targetCurr: string;
    timeSeries?: TimeSerie;
};

export type TimeSerie = {
    changingRates: number[];
    highest: number;
    lowest: number;
    dayRangeIndicator: string[];
    monthRangeIndicator: string[];
};

export type NewsHeadlines = {
    title: string;
    link: string;
    publisher: string;
    publishTime: string;
    diffTimeInHour: number;
    thumbnail: string;
}

export type NavBarProps = DisplayFlags & User & {
    currentUrl: string;
    isOutLineTheme: boolean;
};

export type ConvertorProps = DisplayFlags & User & {
    currCountiesCodeMapDetail: CurrCountiesCodeMapDetail;
    sortedCurrsCodeList: string[];
    validCurFlagList: string[];
    isChartFeatureEnable: boolean;
};

export type ChartProps = ConvertorProps & {
    initialCurrLists: CurrList[];
    initialCurrExchangeRates: string[];
    isReady: boolean;
};

export type NewsProps = DisplayFlags & User & {
    currentUrl: string;
    newsListsRes: string[];
}

export type DisplayFlags = {
    isDisplaySM: boolean;
    isDisplayMD: boolean;
};