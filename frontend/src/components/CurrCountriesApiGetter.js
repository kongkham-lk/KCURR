import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CurrCountriesApiGetter() {
    const [currApiKeyValuePair, setCurrApiKeyValuePair] = useState({});

    useEffect(
        function fetchData() {
            async function fetchCurrOption() {
                try {
                    const resCurrCountries = await axios.get('http://localhost:8080/curr/currency-country');
                    setCurrApiKeyValuePair(resCurrCountries.data);
                } catch (e) {
                    console.log(e.stack);
                }
            }
            fetchCurrOption();
        }, []
    );
    return {currApiKeyValuePair};
};