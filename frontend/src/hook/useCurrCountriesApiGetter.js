import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCurrCountriesApiGetter() {

    const [currCountiesCodeMapDetail, setCurrCountiesCodeMapDetail] = useState({});
    const [isReady, setIsReady] = useState(false);

    const baseURL = process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BASEURL : process.env.REACT_APP_PROD_BASEURL;
    const port = process.env.REACT_APP_TARGET_PORT;

    useEffect(
        function fetchData() {
            async function fetchCurrOption() {
                let resCurrCountries;
                let isValidResponse = false;
                let retryFetching = 5;
          
                while (!isValidResponse && retryFetching > 0) {
                    // console.log(`Requesting data on: ${baseURL}:${port}`); // Debugging frontend request and backend response

                    try {
                        resCurrCountries = await axios.get(`${baseURL}:${port}/curr/currency-country`);
                    } catch (e) {
                        console.log(e.stack);
                    }
                    if (resCurrCountries !== undefined) {
                        if (Object.keys(resCurrCountries.data).length) {
                            setCurrCountiesCodeMapDetail(resCurrCountries.data);
                            setIsReady(true);
                            isValidResponse = true; // Stop the loop
                            // console.log(`Successfully received currency-country data!!!`);
                        }
                        else {
                            console.log(`Data not found!!!`);
                        }
                    }

                    if (!isValidResponse) {
                        // Optionally, you can add a delay before retrying
                        await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay before retrying
                        retryFetching--;
                    }
                }
            }
            fetchCurrOption();
        }, [baseURL]
    );
    return { currCountiesCodeMapDetail, isReady };
};
