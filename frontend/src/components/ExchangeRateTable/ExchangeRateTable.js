import { useState, useEffect } from 'react';
import axios from 'axios';
import ExchangeRateTableData from './ExchangeRateTableData';

export default function ExchangeRateTable(props) {
  const { currCountiesCodeMapDetail } = props;
  const [currApiDataSet, setCurrApiDataSet] = useState([]);

  useEffect(
    function fetchData() {
      async function fetchCurrApiData() {
        try {
          const resExchangeRatesLastest = await axios.post('http://localhost:8080/curr/rate-latest', initialValue);
          const resExchangeRatesHistorical = await axios.post('http://localhost:8080/curr/rate-hist', initialValue);
          const latestRates = resExchangeRatesLastest.data;
          const historicalRates = resExchangeRatesHistorical.data;
          setCurrApiDataSet([latestRates, historicalRates]);
        } catch (e) {
          console.log(e.stack);
        }
      }
      fetchCurrApiData();
    }, []
  );

  return (
    <>
      {currApiDataSet.length > 0 && <ExchangeRateTableData currApiDataSet={currApiDataSet} currCountiesCodeMapDetail={currCountiesCodeMapDetail} />}
    </>
  );
}

const initialValue = { baseCurr: "USD" };