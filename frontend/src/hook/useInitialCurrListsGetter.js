import { useState, useEffect } from 'react';
import { CreateCurrLists } from '../util/createCurrLists';

export default function useInitialCurrListsGetter(defaultCurr, targetCurr, currDataSet) {
    const [initialCurrLists, setInitialCurrLists] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(
        function fetchData() {
            async function fetchCurrApiData() {
                try {
                    const currLists = [];
                    for (let i in targetCurr) {
                        currLists[i] = await CreateCurrLists(defaultCurr, targetCurr[i], currDataSet)
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