import { useState, useEffect } from 'react';
import { createCurrLists } from '../util/createCurrLists';

export default function useInitialCurrListsGetter(defaultCurr, targetCurr, defaultCurrExchangeRates, dayRange, isFeatureDisplay) {
    const [initialCurrLists, setInitialCurrLists] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(
        function fetchData() {
            async function fetchCurrApiData() {
                try {
                    const currLists = [];
                    for (let i in targetCurr) {
                        currLists[i] = await createCurrLists(defaultCurr, targetCurr[i], defaultCurrExchangeRates, dayRange, isFeatureDisplay)
                    }
                    setInitialCurrLists(currLists);
                    setIsReady(true);
                } catch (e) {
                    console.log(e.stack);
                }
            }
            fetchCurrApiData();
        }, []
    );

    return { initialCurrLists, isReady };
}