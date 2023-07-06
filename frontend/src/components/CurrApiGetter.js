import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CurrApiGetter() {
    const [currApiArr, setCurrApiArr] = useState([]);
    const [currApiKeyValuePair, setCurrApiKeyValuePair] = useState({});

    useEffect(
        function fetchData() {
            async function fetchCurrOption() {
                try {
                    const responseCurrOption = await axios.get('http://localhost:8080/curr/currency-country');
                    console.log("responseCurrOption => ", responseCurrOption);
                    const apiArr = getCurrApiArr(responseCurrOption.data.supported_codes);
                    const apiKeyValuePair = getCurrApiKeyValue(responseCurrOption.data.supported_codes);
                    setCurrApiArr([...apiArr]);
                    setCurrApiKeyValuePair(apiKeyValuePair);
                } catch (e) {
                    console.log(e.stack);
                }
            }
            fetchCurrOption();
        }, []
    );
    return {currApiArr, currApiKeyValuePair};
};

function getCurrApiArr(responseCurrOption) {
    const array = responseCurrOption.map(el => (
        { type: el[0], display: `${el[0]} - ${el[1]}` }
    ))
    return array;
}

function getCurrApiKeyValue(responseCurrOption) {
    const keyValuePair = {};
    for (let el of responseCurrOption) {
        keyValuePair[el[0]] = el[1];
    }
    return keyValuePair;
}