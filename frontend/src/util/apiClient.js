import axios from 'axios';

export async function retrieveConvertValue(getFormData, formInputs) {
    try {
        const response = await axios.post('http://localhost:5268/curr/convert', formInputs);
        getFormData(formInputs, response);
    } catch (e) {
        console.log(e.code, "\n", e.stack);
    }
};

export async function retrieveExchangeRates(initialValue) {
    const resExchangeRatesLast = await axios.post('http://localhost:5268/curr/rate-latest', initialValue);
    const resExchangeRatesHist = await axios.post('http://localhost:5268/curr/rate-hist', initialValue);
    return [resExchangeRatesLast.data, resExchangeRatesHist.data];
}

export async function retrieveExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange) {
    const resExchangeRatesTimeSeries = await axios.post('http://localhost:5268/curr/rate-timeSeries', { baseCurr, targetCurr, timeSeriesRange });
    return resExchangeRatesTimeSeries;
}

export async function retrieveFinancialNews(newsTopics) {
    let newsTopic = "";
    for (let i = 0; i < newsTopics.length; i++) {
        newsTopic += newsTopics[i]
        if (i + 1 < newsTopics.length) {
            newsTopic += ", "
        }
    }
    const resFinancialNewsLists = await axios.post('http://localhost:5268/news', { newsTopic: newsTopic });
    return resFinancialNewsLists;
}
