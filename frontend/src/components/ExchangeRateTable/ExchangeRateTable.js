import { useState, useEffect } from 'react';
import ExchangeRateTableData from './ExchangeRateTableData';
import { retrieveExchangeRates } from '../../util/apiClient';

export default function ExchangeRateTable(props) {
  const { currCountiesCodeMapDetail } = props;
  const [currApiDataSet, setCurrApiDataSet] = useState([]);
  const [isReady, setIsReady] = useState(false);


  useEffect(
    function fetchData() {
      async function fetchCurrApiData() {
        try {
          const currDataSet = await retrieveExchangeRates(initialValue);
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
      {isReady && <ExchangeRateTableData currApiDataSet={currApiDataSet} currCountiesCodeMapDetail={currCountiesCodeMapDetail} />}
    </>
  );
}

const initialValue = { baseCurr: "USD" };