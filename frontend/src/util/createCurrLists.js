import { retrieveExchangeRatesTimeSeries } from './apiClient';

export async function createCurrLists(baseCurr, targetCurr, defaultCurrExchangeRates, timeSeriesRange, isFeatureDisplay) {

    if (baseCurr === targetCurr) {
        return { targetCurr: baseCurr, latestRate: 1, change: null, timeSeries: null };
    } else {
        let timeSeries, latestRate, histRate;

        try {
            timeSeries = await sendTimeSeriesReq(baseCurr, targetCurr, timeSeriesRange);
        } catch (e) {
            console.log("ERROR ON AWAIT => ", e);
        }

        // only grab default curr's exchange rate if it is not featureDisplay, else defaultCurrExchangeRates is null
        if (defaultCurrExchangeRates !== null && !isFeatureDisplay) {
            const latestRates = defaultCurrExchangeRates[0];
            const histRates = defaultCurrExchangeRates[1];
            latestRate = latestRates[targetCurr]; // accessing by key as ExchangeRate is key-value pair
            histRate = histRates[targetCurr];
        } else { // grabbing timeSeries's changeRates when display chart feature is on
            latestRate = timeSeries.changingRates[timeSeries.changingRates.length - 1]; // accessing by index as originally timeSeries only consist 1 targetCurr
            histRate = timeSeries.changingRates[0];
        }
        
        const change = (latestRate - histRate) * 100 / histRate;
        console.log('change: ', change);

        return { targetCurr, latestRate: latestRate?.toFixed(4), change: change?.toFixed(2), timeSeries };
    }
}

async function sendTimeSeriesReq(baseCurr, targetCurr, timeSeriesRange) {
    const timeSeriesRes = await retrieveExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange, true);
    return timeSeriesRes.data[targetCurr];
}

