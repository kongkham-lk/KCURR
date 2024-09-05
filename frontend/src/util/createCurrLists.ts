import { retrieveExchangeRatesTimeSeries } from './apiClient';
import { getDayRangeDate, getMonthRangeDate } from './ExchangeRateTableDataUtil';
import { type CurrCodeMapTimeSerie, type CurrCodeMapExchangeRates, type CurrList, type TimeSerie } from '../lib/types';

export async function createCurrLists(baseCurr: string, targetCurr: string, defaultCurrExchangeRates: CurrCodeMapExchangeRates[] | null, 
    timeSeriesRange: string, isFeatureDisplay: boolean): Promise<CurrList> {
    if (baseCurr === targetCurr) {
        return { targetCurr, latestRate: 1, histRate: null, change: null, timeSeries: null }; // skip request data from API for default row
    } else {
        let timeSeries: TimeSerie | null = null;
        let latestRate: number = 0;
        let histRate: number = 0;
        
        // only grab default curr's exchange rate if it is not featureDisplay, else defaultCurrExchangeRates is null
        if (defaultCurrExchangeRates !== null && !isFeatureDisplay) {
            const latestRates: CurrCodeMapExchangeRates = defaultCurrExchangeRates[0];
            const histRates: CurrCodeMapExchangeRates = defaultCurrExchangeRates[1];
            const dayRangeIndicator = [getDayRangeDate(1), getDayRangeDate(0)]; // needed when the live rate table use exchange rate data instead of timeSeries
            const monthRangeIndicator = [getMonthRangeDate(1), getMonthRangeDate(0)]; // needed when the live rate table use exchange rate data instead of timeSeries
            latestRate = latestRates[targetCurr]; // accessing by key as ExchangeRate is key-value pair
            histRate = histRates[targetCurr];
            timeSeries = {
                lowest: Math.min(latestRate, histRate),
                highest: Math.max(latestRate, histRate),
                changingRates: [histRate, latestRate],
                dayRangeIndicator,
                monthRangeIndicator
            };
        } else { // Only request for timeSeries for each visible currency row when display chart feature is on
            try {
                timeSeries = await sendTimeSeriesReq(baseCurr, targetCurr, timeSeriesRange);
                latestRate = timeSeries.changingRates[timeSeries.changingRates.length - 1]; // accessing by index as originally timeSeries only consist 1 targetCurr
                histRate = timeSeries.changingRates[0];
            } catch (e) {
                console.log("ERROR ON AWAIT => ", e);
            }
        }

        const change: number = (latestRate - histRate) * 100 / histRate;

        return { targetCurr, latestRate, histRate, change: change?.toFixed(2), timeSeries };
    }
}

async function sendTimeSeriesReq(baseCurr: string, targetCurr: string, timeSeriesRange: string | null): Promise<TimeSerie> {
    const timeSeriesRes: CurrCodeMapTimeSerie = await retrieveExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange, true);
    return timeSeriesRes[targetCurr];
}

