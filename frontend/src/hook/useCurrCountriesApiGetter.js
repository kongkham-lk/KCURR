import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCurrCountriesApiGetter() {
    const [currCountiesCodeMapDetail, setCurrCountiesCodeMapDetail] = useState({});
    const [isReady, setIsReady] = useState(false);

    const baseURL = process.env.NODE_ENV === "development" ? "https://localhost" : "https://kcurr-backend.onrender.com";
    const port = 5268;

    useEffect(
        function fetchData() {
            async function fetchCurrOption() {
                let resCurrCountries;
                try {
                    resCurrCountries = await axios.get(`${baseURL}:${port}/curr/currency-country`);
                } catch (e) {
                    console.log(e.stack);
                }
                if (resCurrCountries !== undefined) {
                    setCurrCountiesCodeMapDetail(resCurrCountries.data);
                    setIsReady(true);
                }
            }
            fetchCurrOption();
        }, [baseURL]
    );
    return { currCountiesCodeMapDetail, isReady };
};
