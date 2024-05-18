import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCurrCountriesApiGetter() {
    const [currCountiesCodeMapDetail, setCurrCountiesCodeMapDetail] = useState({});
    const [isReady, setIsReady] = useState(false);

    const baseURL = process.env.NODE_ENV === "Development" ? process.env.DEV_BASEURL : process.env.PROD_BASEURL;

    useEffect(
        function fetchData() {
            async function fetchCurrOption() {
                let resCurrCountries;
                try {
                    resCurrCountries = await axios.get(`${baseURL}/curr/currency-country`);
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
