import { useState, useEffect } from 'react';
import { createCurrLists } from '../util/createCurrLists';
import { retrieveExchangeRates } from '../util/apiClient';

export default function useInitialCurrListsGetter(defaultCurr, currCodeArray, dayRange, isFeatureDisplay, userPreference = null) {
    const [initialCurrLists, setInitialCurrLists] = useState([]);
    const [initialCurrExchangeRates, setInitialCurrExchangeRates] = useState([]);
    const [isReady, setIsReady] = useState(false);

    // reassign all neccessary props when this function is invoked on App.js
    if (userPreference !== null) {
        currCodeArray = [...userPreference.liveRateCurrCodes];
        defaultCurr = currCodeArray[0];
        dayRange = "1d";
    }

    // Only fetch exchange rate list from APIs when users are on home page
    // this will be used when it is not neccessary to fetch timeSeries data for each visible currency row on live rate table
    const fetchExchangeRatesDayRange = async (defaultCurr) => {
        const initialDefaultCurr = { baseCurr: defaultCurr }; // use the manual currency code as starter default currency
        return await retrieveExchangeRates(initialDefaultCurr);
    }

    useEffect(
        function fetchData() {
            async function fetchCurrApiData() {
                if (initialCurrLists.length === 0) {
                    try {
                        const currLists = [];
                        // console.log("defaultCurr: ", defaultCurr)
                        const currExchangeRates = isFeatureDisplay ? null : await fetchExchangeRatesDayRange(defaultCurr);
                        // console.log("currExchangeRates: ", currExchangeRates)
                        console.log("    >>> createCurrLists!!!")
                        for (let i in currCodeArray) {
                            currLists[i] = await createCurrLists(defaultCurr, currCodeArray[i], currExchangeRates, dayRange, isFeatureDisplay)
                        }
                        setInitialCurrExchangeRates(currExchangeRates);
                        setInitialCurrLists(currLists);
                        setIsReady(true);
                    } catch (e) {
                        console.log(e.stack);
                    }
                }
            }
            fetchCurrApiData();
        }, [dayRange, defaultCurr, isFeatureDisplay, currCodeArray]
    );

    return { initialCurrLists, initialCurrExchangeRates, isReady };
}