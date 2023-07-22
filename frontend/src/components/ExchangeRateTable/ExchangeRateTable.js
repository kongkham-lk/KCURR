import { useState, useEffect } from 'react';
import axios from 'axios';
import ExchangeRateTableData from './ExchangeRateTableData';
import { retrieveExchangeRates } from '../../util/apiClient'

export default function ExchangeRateTable(props) {
  const { currCountiesCodeMapDetail } = props;
  const [currApiDataSet, setCurrApiDataSet] = useState([]);

  useEffect(
    function fetchData() {
      async function fetchCurrApiData() {
        try {
          setCurrApiDataSet(retrieveExchangeRates(initialValue));
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