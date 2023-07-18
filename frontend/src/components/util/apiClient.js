import axios from 'axios';

export async function retrieveConvertValue (getFormData, formInputs) {
    try {
        const response = await axios.post('http://localhost:8080/curr/convert', formInputs);
        getFormData(formInputs, response);
    } catch (e) {
        console.log(e.code, "\n", e.stack);
    }
};

export async function retrieveExchangeRates (initialValue) {
    const resExchangeRatesLast = await axios.post('http://localhost:8080/curr/rate-latest', initialValue);
    const resExchangeRatesHist = await axios.post('http://localhost:8080/curr/rate-hist', initialValue);
    return [resExchangeRatesLast.data, resExchangeRatesHist.data];
} 