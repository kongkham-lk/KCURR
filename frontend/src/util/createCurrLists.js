export function createCurrLists(baseCurr, targetCurr, currApiDataSet) {
    const latestRates = currApiDataSet[0];
    const histRates = currApiDataSet[1];
    if (baseCurr === targetCurr) {
        return { targetCurr: baseCurr, latestRate: 1, change: null };
    } else {
        const latestRate = latestRates[targetCurr];
        const histRate = histRates[targetCurr];
        const change = (latestRate - histRate) * 100 / histRate;
        return { targetCurr, latestRate: latestRate?.toFixed(4), change: change?.toFixed(2) };
    }
}