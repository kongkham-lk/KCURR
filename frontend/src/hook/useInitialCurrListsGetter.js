import { useState, useEffect } from 'react';
import { createCurrLists } from '../util/createCurrLists';
import { retrieveExchangeRates } from '../util/apiClient';

export default function useInitialCurrListsGetter(defaultCurr, targetCurr, dayRange, isFeatureDisplay) {
    const [initialCurrLists, setInitialCurrLists] = useState([]);
    const [initialCurrExchangeRates, setInitialCurrExchangeRates] = useState([]);
    const [isReady, setIsReady] = useState(false);

    // Only fetch exchange rate list from APIs when users are on home page
    // this will be used when it is not neccessary to fetch timeSeries data for each visible currency row on live rate table
    const fetchExchangeRatesDayRange = async (defaultCurr) => {
        const initialDefaultCurr = { baseCurr: defaultCurr }; // use the manual currency code as starter default currency
        return await retrieveExchangeRates(initialDefaultCurr);
    }

    useEffect(
        function fetchData() {
            async function fetchCurrApiData() {
                try {
                    const currLists = [];
                    // console.log("defaultCurr: ", defaultCurr)
                    const currExchangeRates = isFeatureDisplay ? null : await fetchExchangeRatesDayRange(defaultCurr);
                    // console.log("currExchangeRates: ", currExchangeRates)
                    for (let i in targetCurr) {
                        currLists[i] = await createCurrLists(defaultCurr, targetCurr[i], currExchangeRates, dayRange, isFeatureDisplay)
                    }
                    setInitialCurrExchangeRates(currExchangeRates);
                    setInitialCurrLists(currLists);
                    setIsReady(true);
                } catch (e) {
                    console.log(e.stack);
                }
            }
            fetchCurrApiData();
        }, []
    );

    return { initialCurrLists, initialCurrExchangeRates, isReady };
}