import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCurrCountriesApiGetter() {
    const [currCountiesCodeMapDetail, setCurrCountiesCodeMapDetail] = useState({});
    const [isReady, setIsReady] = useState(false);

    console.log("currCountiesCodeMapDetail => ", currCountiesCodeMapDetail)

    useEffect(
        function fetchData() {
            async function fetchCurrOption() {
                try {
                    const resCurrCountries = await axios.get('http://localhost:8080/curr/currency-country');
                    setCurrCountiesCodeMapDetail(resCurrCountries.data);
                    setIsReady(true);
                } catch (e) {
                    console.log(e.stack);
                }
            }
            fetchCurrOption();
        }, []
    );
    return { currCountiesCodeMapDetail, isReady };
};
