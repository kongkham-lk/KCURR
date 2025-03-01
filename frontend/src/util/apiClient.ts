import axios from 'axios';
import { type CurrCodeMapTimeSerie, type CurrCodeMapExchangeRates } from '../lib/types';

const baseURL: string | undefined = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_BASEURL
    : process.env.REACT_APP_PROD_BASEURL;
const port: string | undefined = process.env.REACT_APP_TARGET_PORT;

type DefaultCurrWrapper = { baseCurr: string };

export async function retrieveConvertValue(targetConvertAmount: number, targetConvertCurrencies: string[]): Promise<number> {
    const formInputs = {
        amount: targetConvertAmount,
        baseCurr: targetConvertCurrencies[0],
        targetCurr: targetConvertCurrencies[1]
    };
    // console.log("Form inputs: ", formInputs)
    try {
        const response = await axios.post(`${baseURL}:${port}/curr/convert`, formInputs);
        // console.log("response: ", response)
        return response.data;
    } catch (e: any) {
        console.log(e.code, "\n", e.stack);
        return -1;
    }
};

export async function retrieveExchangeRates(defaultCurr: DefaultCurrWrapper): Promise<CurrCodeMapExchangeRates[]> {
    const resExchangeRatesLast = await axios.post(`${baseURL}:${port}/curr/rate-latest`, defaultCurr);
    const resExchangeRatesHist = await axios.post(`${baseURL}:${port}/curr/rate-hist`, defaultCurr);
    return [resExchangeRatesLast.data, resExchangeRatesHist.data];
}

export async function retrieveExchangeRatesTimeSeries(baseCurr: string, targetCurr: string, timeSeriesRange: string | null, isNewUpdateRequest: boolean): Promise<CurrCodeMapTimeSerie> {
    const resExchangeRatesTimeSeries = await axios.post(`${baseURL}:${port}/curr/rate-timeSeries`, { baseCurr, targetCurr, timeSeriesRange, isNewUpdateRequest });
    return resExchangeRatesTimeSeries.data;
}

export async function retrieveFinancialNews(newsTopics: string[] | undefined) {
    if (newsTopics === undefined)
        return null
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
