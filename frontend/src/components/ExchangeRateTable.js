import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import ExchangeRateTableData from './ExchangeRateTableData';
import CurrCountries from './CurrCountries';

export default function ExchagneRateTable({ currApiKeyValuePair, currApiArr }) {
  const [currApiDataSet, setCurrApiDataSet] = useState([]);
  const [newCurrList, setNewCurrList] = useState({baseCurr: "USD", targetCurr:""});

  useEffect(
    function fetchData() {
      async function fetchCurrOption() {
        try {
          const resExchangeRatesLast = await axios.post('http://localhost:8080/api/rate', initialValue.lastest);
          const lastestRate = resExchangeRatesLast.data.conversion_rates;
          let resExchangeRatesHist;
          try {
            // if cannot fetch the api data
            resExchangeRatesHist = await axios.post('http://localhost:8080/api/rate', initialValue.hist);
          } catch (e) {
            // return fake dataSet
            resExchangeRatesHist = {
              data: {
                conversion_rates: {"CAD": 1.3168, "EUR": 0.9013, "GBP": 0.7679,}
              }
            };
          }
          if (resExchangeRatesHist != null) {
            const histRate = resExchangeRatesHist.data.conversion_rates;
            setCurrApiDataSet([lastestRate, histRate]);
          } else {
            setCurrApiDataSet(lastestRate);
          }
        } catch (e) {
          console.log(e.stack);
        }
      }
      fetchCurrOption();
    }, []
  );

  const handleChange = (e) => {
    setNewCurrList({[e.name]: e.value});
  };

  return (
    <>
      <TableContainer component={Paper} style={style.TableContainer}>
        <Table sx={sxStyle.Table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Country Currency</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Change&nbsp;(24h)</TableCell>
            </TableRow>
          </TableHead>
          {currApiDataSet.length > 0 && <ExchangeRateTableData currApiDataSet={currApiDataSet} newCurrList={newCurrList} currApiKeyValuePair={currApiKeyValuePair} />}
        </Table>
      </TableContainer>
      <CurrCountries sxStyle={sxStyle.CurrCountries} label="Add Currency" stateInputField="targetCurr" updateVal={handleChange} currApiArr={currApiArr} sx={{ml: 20}} />
    </>
  );
}

const initialValue = {
  lastest: { baseCurr: "USD", rateDataSet: "lastest" },
  hist: { baseCurr: "USD", rateDataSet: "hist" },
};

const sxStyle = {
  Table: { width: 1 },
  CurrCountries: {minWidth: 200, width: 250},
};

const style = {
  TableContainer: { marginBottom: "20px" }
}