import { useState, useEffect } from 'react';
import axios from 'axios';

export function useCurrRateTimeSeriesGetter() {
    const [rateTimeSeries, setRateTimeSeries] = useState({});
    const [isReady, setIsReady] = useState(false);
 
useEffect(
    function fetchData() {
        async function fetchTimeSeries() {
            const seriesOfRates = await axios.get('http://localhost:8080/curr/currency-timeseries');
        }
    }
)
}


// const [rateTimeSeries, setRateTimeSeries] = useState({
//     targetCurr: {
//         timeSeries: [], 
//         highest: 0,
//         mid: 0,
//         lowest: 0,
//     },
// });