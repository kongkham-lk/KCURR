import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ExchangeRateTableData from './ExchangeRateTableData';

const initialValue = { baseCurr: "USD" };

export default function ExchangeRateTable({ currApiKeyValuePair }) {
  const [currApiDataSet, setCurrApiDataSet] = useState([]);

  useEffect(
    function fetchData() {
      async function fetchCurrApiData() {
        try {
          const resExchangeRatesLast = await axios.post('http://localhost:8080/curr/rate-latest', initialValue);
          const resExchangeRatesHist = await axios.post('http://localhost:8080/curr/rate-hist', initialValue);
          const latestRates = resExchangeRatesLast.data;
          const histRates = resExchangeRatesHist.data;
          setCurrApiDataSet([latestRates, histRates]);
        } catch (e) {
          console.log(e.stack);
        }
      }
      fetchCurrApiData();
    }, []
  );

  return (
    <>
      {currApiDataSet.length > 0 && <ExchangeRateTableData currApiDataSet={currApiDataSet} currApiKeyValuePair={currApiKeyValuePair} />}
    </>
  );
}