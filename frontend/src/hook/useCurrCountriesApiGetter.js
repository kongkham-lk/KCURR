import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCurrCountriesApiGetter() {
    const [currCountiesCodeMapDetail, setCurrCountiesCodeMapDetail] = useState({});
    const [isReady, setIsReady] = useState(false);

    const devBaseURL = "http://localhost:5268";
    const prodBaseURL = "https://kcurr-backend.onrender.com";

    useEffect(
        function fetchData() {
            async function fetchCurrOption() {
                let resCurrCountries;
                try {
                    resCurrCountries = await axios.get(`${devBaseURL}/curr/currency-country`);
                } catch (e) {
                    console.log(e.stack);
                }
                if (resCurrCountries !== undefined) {
                    setCurrCountiesCodeMapDetail(resCurrCountries.data);
                    setIsReady(true);
                }
            }
            fetchCurrOption();
        }, []
    );
    return { currCountiesCodeMapDetail, isReady };
};
