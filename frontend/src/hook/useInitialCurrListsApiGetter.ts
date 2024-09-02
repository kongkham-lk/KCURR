import { useState, useEffect } from 'react';
import { createCurrLists } from '../util/createCurrLists';
import { retrieveExchangeRates } from '../util/apiClient';
import { getCurrListsFromCookie } from './userController';
import { type Preference, type CurrCodeMapExchangeRates, type CurrList, type InitialCurrListsApi } from '../lib/types';

export default function useInitialCurrListsApiGetter(defaultCurr: string, currCodeArray: string[], dayRange: string,
    isFeatureDisplay: boolean, userPreference: Preference | null = null, userId: string): InitialCurrListsApi {
    const [initialCurrLists, setInitialCurrLists] = useState<CurrList[]>([]);
    const [initialCurrExchangeRates, setInitialCurrExchangeRates] = useState<CurrCodeMapExchangeRates[] | null>([]);
    const [isReady, setIsReady] = useState<boolean>(false);

    // reassign all neccessary props when this function is invoked on App.js
    if (userPreference !== null) {
        currCodeArray = Object.assign([], userPreference.liveRateCurrCodes);
        defaultCurr = currCodeArray[0];
        dayRange = "1d";
    }

    // Only fetch exchange rate list from APIs when users are on home page
    // this will be used when it is not neccessary to fetch timeSeries data for each visible currency row on live rate table
    const fetchExchangeRatesDayRange = async (defaultCurr: string): Promise<CurrCodeMapExchangeRates[] | null> => {
        if (defaultCurr === null)
            return null;

        const initialDefaultCurr = { baseCurr: defaultCurr }; // use the manual currency code as starter default currency
        return await retrieveExchangeRates(initialDefaultCurr);
    }

    useEffect(
        function fetchData() {
            async function fetchCurrApiData() {
                if (currCodeArray !== null && currCodeArray.length > 0) {
                    if (initialCurrLists.length === 0) {
                        // This will be triggered whenever the page is refreshed
                        try {
                            const currLists: CurrList[] = [];
                            // console.log("defaultCurr: ", defaultCurr)
                            const currExchangeRates: CurrCodeMapExchangeRates[] | null = isFeatureDisplay ? null : await fetchExchangeRatesDayRange(defaultCurr);
                            // console.log("currExchangeRates: ", currExchangeRates)
                            // console.log("    >>> createCurrLists!!! ", currCodeArray)
                            for (let i in currCodeArray) {
                                currLists[i] = await createCurrLists(defaultCurr, currCodeArray[i], currExchangeRates, dayRange, isFeatureDisplay)
                            }
                            setInitialCurrExchangeRates(currExchangeRates);
                            setInitialCurrLists(currLists);
                            setIsReady(true);
                        } catch (e: any) {
                            console.log(e.stack);
                        }
                    } else {
                        // Update initialCurrLists if not match with currList that save in browser's cookie
                        if (initialCurrLists[0].targetCurr !== currCodeArray[0]) {
                            // console.log("initialCurrLists: ", initialCurrLists)
                            // console.log("currCodeArray: ", currCodeArray)
                            const savedCurrLists: CurrList[] | null = getCurrListsFromCookie(userId);
                            // console.log("savedCurrLists: ", savedCurrLists)
                            if (savedCurrLists !== null) {
                                // console.log("setInitialCurrLists!!!")
                                setInitialCurrLists(savedCurrLists);
                            }
                        }
                    }
                }
            }
            fetchCurrApiData();
        }, [dayRange, defaultCurr, isFeatureDisplay, currCodeArray, initialCurrLists, userId]
    );

    return { initialCurrLists, initialCurrExchangeRates, isReady };
}