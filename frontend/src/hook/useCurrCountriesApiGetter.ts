import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { fetchAllCountryFlags } from '../util/getFlag';
import { type CurrCountriesApi, type CurrCodeByDetail, type CurrCodeMapDetail } from '../lib/types';

export default function useCurrCountriesApiGetter(): CurrCountriesApi {
    const [currCountiesCodeMapDetail, setCurrCountiesCodeMapDetail] = useState<CurrCodeMapDetail>({});
    const [sortedCurrsCodeList, setSortedCurrsCodeList] = useState<string[]>([]);
    const [validCurFlagList, setValidCurFlagList] = useState<string[]>([]); // the curr code flag that api return 404 status
    const [isReady, setIsReady] = useState<boolean>(false);

    const baseURL: string | undefined = process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_DEV_BASEURL
        : process.env.REACT_APP_PROD_BASEURL;
    const port: string | undefined = process.env.REACT_APP_TARGET_PORT;

    useEffect(
        function fetchData() {
            async function fetchCurrOption() {
                let resCurrCountries: AxiosResponse<CurrCodeByDetail> | undefined;
                let isValidResponse = false;
                let retryFetching = 5;

                while (!isValidResponse && retryFetching > 0) {
                    // console.log(`Requesting data on: ${baseURL}:${port}`); // Debugging frontend request and backend response
                    try {
                        resCurrCountries = await axios.get(`${baseURL}:${port}/curr/currency-country`);
                    } catch (e: any) {
                        console.log(e.stack);
                    }
                    if (resCurrCountries !== undefined) {
                        if (Object.keys(resCurrCountries.data).length) {
                            setCurrCountiesCodeMapDetail(resCurrCountries.data);
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
        }, [baseURL, port]
    );

    useEffect(() => {
        async function fetchCountriesFlags() {
            if (Object.keys(currCountiesCodeMapDetail).length !== 0) {
                // console.log("check all cur code for flag api!!!");
                const newSortedCurrsCodeList: string[] = Object.keys(currCountiesCodeMapDetail).sort();
                const newValidCurrFlagList: string[] = await fetchAllCountryFlags();

                setSortedCurrsCodeList(newSortedCurrsCodeList);
                setValidCurFlagList(newValidCurrFlagList);
                setIsReady(true);
                // console.log("return newValidCurrFlagList: ", newValidCurrFlagList);
            }
        }
        fetchCountriesFlags();
    }, [currCountiesCodeMapDetail]);

    return { currCountiesCodeMapDetail, sortedCurrsCodeList, validCurFlagList, isReady };
};
