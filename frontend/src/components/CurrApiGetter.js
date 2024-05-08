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
                    const apiArr = getCurrApiArr(responseCurrOption.data.data);
                    const apiKeyValuePair = getCurrApiKeyValue(responseCurrOption.data.data);
                    setCurrApiArr([...apiArr].sort(compare));
                    setCurrApiKeyValuePair(apiKeyValuePair);
                } catch (e) {
                    console.log(e.stack);
                }
            }
            fetchCurrOption();
        }, []
    );
    return { currApiArr, currApiKeyValuePair };
};

function getCurrApiArr(resDataForArray) {
    const keys = Object.keys(resDataForArray);
    const array = keys.map(key => (
        { type: key, display: `${key} - ${resDataForArray[key].name}`, symbol: resDataForArray[key].symbol_native }
    ))
    return array;
}

function getCurrApiKeyValue(resDataForAKeyVal) {
    let keyValuePair = {};
    const keys = Object.keys(resDataForAKeyVal);
    for (let key of keys) {
        keyValuePair[key] = resDataForAKeyVal[key].name;
    }
    return keyValuePair;
}

function compare(a, b) {
    if (a.type < b.type) return -1;
    if (a.type > b.type) return 1;
    return 0;
}