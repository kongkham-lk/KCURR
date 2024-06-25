import { retrieveExchangeRatesTimeSeries } from './apiClient';

export async function createCurrLists(baseCurr, targetCurr, currApiDataSet, timeSeriesRange) {
    const latestRates = currApiDataSet[0];
    const histRates = currApiDataSet[1];

    if (baseCurr === targetCurr) {
        return { targetCurr: baseCurr, latestRate: 1, change: null, timeSeries: null };
    } else {
        const latestRate = latestRates[targetCurr];
        const histRate = histRates[targetCurr];
        const change = (latestRate - histRate) * 100 / histRate;
        let timeSeries;
        try {
            timeSeries = await sendTimeSeriesReq(baseCurr, targetCurr, timeSeriesRange);
        } catch (e) {
            console.log("ERROR ON AWAIT => ", e);
        }
        return { targetCurr, latestRate: latestRate?.toFixed(4), change: change?.toFixed(2), timeSeries };
    }
}

async function sendTimeSeriesReq(baseCurr, targetCurr, timeSeriesRange) {
    const timeSeriesRes = await retrieveExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange, true);
    return timeSeriesRes.data[targetCurr];
}

