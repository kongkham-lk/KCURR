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
                    const apiArr = getCurrApiArr(responseCurrOption);
                    const apiKeyValuePair = getCurrApiKeyValue(responseCurrOption);
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
    let array = [];
    let i = 0;
    for (const[key, value] of Object.entries(responseCurrOption)) {
        const keyValuePair = {type: key, display: `${key} - ${value.name}`}
        array[i] = keyValuePair;
    }
    return array;
}

function getCurrApiKeyValue(responseCurrOption) {
    const keyValuePair = {};
    for (const[key, value] of Object.entries(responseCurrOption.data)) {
        keyValuePair[key] = value.value;
    }
    return keyValuePair;
}