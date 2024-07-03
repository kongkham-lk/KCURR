import { useState, useEffect } from 'react';
import ExchangeRateTableData from './ExchangeRateTableData';
import { retrieveExchangeRates } from '../../util/apiClient';
import { useParams } from 'react-router-dom';

export default function ExchangeRateTable(props) {
    const { currentUrl } = props;
    const [initialDefaultCurrExchangeRates, setInitialDefaultCurrExchangeRates] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const { curr } = useParams(); // in case the URL specify a specific default currency code
    const initialDefaultCurr = { baseCurr: curr != null ? curr.substring(0, 3).toUpperCase() : "USD" }; // use the manual currency code as starter default currency
    
    // enable live rate's display chart feature flag
    // if yes, retrieve timeSeries instead of exchangeRates
    const displayFeature = currentUrl.pathname.toLowerCase().includes("chart");

    useEffect(
        function fetchData() {
            async function fetchCurrApiData() {
                try {
                    const defaultCurrExchangeRates = await retrieveExchangeRates(initialDefaultCurr);
                    setInitialDefaultCurrExchangeRates(defaultCurrExchangeRates);
                    setIsReady(true);
                } catch (e) {
                    console.log(e.stack);
                }
            }
            fetchCurrApiData();
        }, []
    );

    const propsWrapper = {
        initialDefaultCurrExchangeRates,
        initialDefaultCurr,
        displayFeature,
        ...props
    }

    return (
        <>
            {isReady && <ExchangeRateTableData {...propsWrapper} />}
        </>
    );
}