import axios from 'axios';


const baseURL = process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BASEURL : process.env.REACT_APP_PROD_BASEURL;
const port = process.env.REACT_APP_TARGET_PORT;

export async function retrieveConvertValue(targetConvertAmount, targetConvertCurrencies) {
    const formInputs = {
        amount: targetConvertAmount,
        baseCurr: targetConvertCurrencies[0],
        targetCurr: targetConvertCurrencies[1]
    };
    // console.log("Form inputs: ", formInputs)
    try {
        const response = await axios.post(`${baseURL}:${port}/curr/convert`, formInputs);
        // console.log("response: ", response)
        return response;
    } catch (e) {
        console.log(e.code, "\n", e.stack);
    }
};

export async function retrieveExchangeRates(initialValue) {
    const resExchangeRatesLast = await axios.post(`${baseURL}:${port}/curr/rate-latest`, initialValue);
    const resExchangeRatesHist = await axios.post(`${baseURL}:${port}/curr/rate-hist`, initialValue);
    return [resExchangeRatesLast.data, resExchangeRatesHist.data];
}

export async function retrieveExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange, isNewUpdateRequest) {
    const resExchangeRatesTimeSeries = await axios.post(`${baseURL}:${port}/curr/rate-timeSeries`, { baseCurr, targetCurr, timeSeriesRange, isNewUpdateRequest });
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
    const resFinancialNewsLists = await axios.post(`${baseURL}:${port}/news`, { newsTopic: newsTopic });
    return resFinancialNewsLists;
}
