import axios from 'axios';

const baseURL = process.env.NODE_ENV === "Development" ? process.env.DEV_BASEURL : process.env.PROD_BASEURL;

export async function retrieveConvertValue(getFormData, formInputs) {
    try {
        const response = await axios.post(`${baseURL}/curr/convert`, formInputs);
        getFormData(formInputs, response);
    } catch (e) {
        console.log(e.code, "\n", e.stack);
    }
};

export async function retrieveExchangeRates(initialValue) {
    const resExchangeRatesLast = await axios.post(`${baseURL}/curr/rate-latest`, initialValue);
    const resExchangeRatesHist = await axios.post(`${baseURL}/curr/rate-hist`, initialValue);
    return [resExchangeRatesLast.data, resExchangeRatesHist.data];
}

export async function retrieveExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange) {
    const resExchangeRatesTimeSeries = await axios.post(`${baseURL}/curr/rate-timeSeries`, { baseCurr, targetCurr, timeSeriesRange });
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
    const resFinancialNewsLists = await axios.post(`${baseURL}/news`, { newsTopic: newsTopic });
    return resFinancialNewsLists;
}
