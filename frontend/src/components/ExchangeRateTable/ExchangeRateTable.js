import { useState, useEffect } from 'react';
import ExchangeRateTableData from './ExchangeRateTableData';
import { retrieveExchangeRates } from '../../util/apiClient';
import { useParams } from 'react-router-dom';

export default function ExchangeRateTable(props) {
  const { currCountiesCodeMapDetail, isDisplaySM } = props;
  const [currApiDataSet, setCurrApiDataSet] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const { curr } = useParams();

  const initialDefaultCurr = { baseCurr: curr != null ? curr.substring(0, 3).toUpperCase() : "USD" };

  useEffect(
    function fetchData() {
      async function fetchCurrApiData() {
        try {
          const currDataSet = await retrieveExchangeRates(initialDefaultCurr);
          setCurrApiDataSet(currDataSet);
          setIsReady(true);
        } catch (e) {
          console.log(e.stack);
        }
      }
      fetchCurrApiData();
    }, []
  );

  return (
    <>
      {isReady && <ExchangeRateTableData currApiDataSet={currApiDataSet} currCountiesCodeMapDetail={currCountiesCodeMapDetail} 
          initialDefaultCurr={initialDefaultCurr} isDisplaySM={isDisplaySM} />}
    </>
  );
}