export type User = {
    userId: string;
    userPreference: Preference | null;
    onThemeUpdate: (newTheme: string) => Promise<void>;
};

export type Preference = {
    theme: string;
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

type CurrCode = string;
type ExchangeRates = number;

export type IsChartFeatureEnable = { isChartFeatureEnable: boolean };

export type CurrCodeMapExchangeRates = Record<CurrCode, ExchangeRates>;

export type CurrCodeMapDetail = Record<CurrCode, CurrCountriesDetail>;

export type CurrCodeMapTimeSerie = Record<CurrCode, TimeSerie>;

export type CurrCountriesDetail = {
    countryName: string;
    currCode: string;
    currSymbol: string;
    display: string;
    flagCode: string;
};

export type CurrList = {
    targetCurr: string;
    latestRate: number;
    histRate: number | null;
    change?: string | null;
    timeSeries: TimeSerie | null;
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
};

export type CurrCodeByDetail = Record<CurrCode, CurrCountryDetail>;

export type CurrCountryDetail = {
    currCode: string;
    countryName: string;
    display: string;
    currSymbol: string;
    flagCode: string;
};

export type CurrCountriesApi = {
    currCountiesCodeMapDetail: CurrCodeMapDetail;
    sortedCurrsCodeList: string[];
    validCurFlagList: string[];
    isReady?: boolean
};

export type InitialCurrListsApi = {
    initialCurrLists: CurrList[];
    initialCurrExchangeRates: CurrCodeMapExchangeRates[] | null;
    isReady: boolean;
};

export type NewCurrCodeAssigned = {
    isBaseCurrency: number;
    value: string;
};

export type NewsProps = DisplayFlags & User & {
    currentUrl: string;
    newsListsRes: string[];
};

export type ThemeOption = {
    iconType: string; 
    label: string;
};

export type DisplayFlags = {
    isDisplaySM: boolean;
    isDisplayMD: boolean;
};

export type Order = 'asc' | 'desc';