import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from 'axios';
import ExchagneRateTableData from './ExchangeRateTableData';

const initialValue = [
  { sourceCurr: "USD", rateDataSet: "lastest" },
  { sourceCurr: "USD", rateDataSet: "hist" },
]; 

export default function ExchagneRateTable() {
  const [currData, setCurrData] = useState([]);

  useEffect(
    function fetchData() {
      async function fetchCurrOption() {
        try {
          const resExchangeRatesLast = await axios.post('http://localhost:8080/api/rate', initialValue[0]);
          const lastestRate = resExchangeRatesLast.data.conversion_rates;
          let resExchangeRatesHist;
          try {
            // if cannot fetch the api data
            resExchangeRatesHist = await axios.post('http://localhost:8080/api/rate', initialValue[1]);
          } catch (e) {
            // return fake dataSet
            resExchangeRatesHist = {
              data: {
                conversion_rates: {
                  "CAD": 1.3168,
                  "EUR": 0.9013,
                  "GBP": 0.7679,
                }
              }
            };
          }
          if (resExchangeRatesHist != null) {
            const histRate = resExchangeRatesHist.data.conversion_rates;
            setCurrData([lastestRate, histRate]);
          } else {
            setCurrData(lastestRate);
          }
        } catch (e) {
          console.log(e.stack);
        }
      }
      fetchCurrOption();
    }, []
  );

  console.log("currData => ", currData);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Country Currency</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Change&nbsp;(24h)</TableCell>
            </TableRow>
          </TableHead>
          {currData.length > 0 && <ExchagneRateTableData currData={currData} />}
        </Table>
      </TableContainer>
      <Button variant="contained" type="button" style={{ marginTop: "25px" }}>Add Currency</Button>
    </>
  );
}