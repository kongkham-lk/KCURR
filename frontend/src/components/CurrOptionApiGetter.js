import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CurrOptionApiGetter() {
    const [currOption, setCurrOption] = useState([]);
    const [currKeyValue, setCurrKeyValue] = useState({});

    useEffect(
        function fetchData() {
            async function fetchCurrOption() {
                try {
                    const responseCurrOption = await axios.get('http://localhost:8080/api/exchange-rate');
                    const option = getCurrOpt(responseCurrOption.data.supported_codes);
                    const keyValue = getCurrKeyValue(responseCurrOption.data.supported_codes);
                    setCurrOption([...option]);
                    setCurrKeyValue(keyValue);
                } catch (e) {
                    console.log(e.stack);
                }
            }
            fetchCurrOption();
        }, []
    );
  
    function getCurrOpt(responseCurrOption) {
        const option = responseCurrOption.map(el => (
            { type: el[0], display: `${el[0]} - ${el[1]}` }
        ))
        return option;
    }
  
    function getCurrKeyValue(responseCurrOption) {
        const keyValue = {};
        responseCurrOption.map(el => {keyValue[el[0]] = el[1]})
        return keyValue;
    }

    return {currOption, currKeyValue};
}