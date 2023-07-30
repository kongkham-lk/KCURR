import { retrieveExchangeRatesTimeSeries } from './apiClient';

export async function CreateCurrLists(baseCurr, targetCurr, currApiDataSet, timeSeriesRange) {
    const latestRates = currApiDataSet[0];
    const histRates = currApiDataSet[1];

    if (baseCurr === targetCurr) {
        return { targetCurr: baseCurr, latestRate: 1, change: null, timeSeries: null };
    } else {
        const latestRate = latestRates[targetCurr];
        const histRate = histRates[targetCurr];
        const change = (latestRate - histRate) * 100 / histRate;
        const timeSeriesRes = await retrieveExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange);
        const timeSeries = timeSeriesRes.data[targetCurr];
        return { targetCurr, latestRate: latestRate?.toFixed(4), change: change?.toFixed(2), timeSeries};
    }
}
