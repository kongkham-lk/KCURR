import * as React from 'react';
import { useState, useEffect } from 'react';
// import Table from '@mui/material/Table';
// import TableRow from '@mui/material/TableRow';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
// import ExchangeRateTableData from './ExchangeRateTableData';
import CurrCountries from './CurrCountries';

export default function ExchangeRateTable({ currApiKeyValuePair, currApiArr }) {

  const [currApiDataSet, setCurrApiDataSet] = useState([]);

  const initialRow = [
    createCurrLists('USD', 'USD', currApiDataSet, currApiKeyValuePair),
    createCurrLists('USD', 'CAD', currApiDataSet, currApiKeyValuePair),
    createCurrLists('USD', 'EUR', currApiDataSet, currApiKeyValuePair),
    createCurrLists('USD', 'GBP', currApiDataSet, currApiKeyValuePair),
  ];

  // const [newCurrList, setNewCurrList] = useState({baseCurr: "USD", targetCurr:""});
  const [currLists, setCurrLists] = useState(initialRow);
  // const [fakeRecords, setFakeRecords] = useState({});

  useEffect(
    function fetchData() {
      async function fetchCurrApiData() {
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
                conversion_rates: { "CAD": 1.3168, "EUR": 0.9013, "GBP": 0.7679, }
              }
            };
          }
          if (resExchangeRatesHist != null) {
            const histRate = resExchangeRatesHist.data.conversion_rates;
            setCurrApiDataSet([lastestRate, histRate]);
          } else {
            setCurrApiDataSet((oldData) => {
              return [...oldData, lastestRate]
            });
          }
        } catch (e) {
          console.log(e.stack);
        }
      }
      fetchCurrApiData();
    }, []
  );

  const handleChange = (e) => {
    const targetCurr = e.value
    if (targetCurr !== "" && !checkIfExist(targetCurr, currLists)) {
      const currList = createCurrLists('USD', targetCurr, currApiDataSet, currApiKeyValuePair);
      const newLists = [...currLists, currList];
      setCurrLists(newLists);
      // setFakeRecords((newFakeRecords) => {
      //     return { ...newFakeRecords, [newCurrList.targetCurr]: ((Math.random() * 4) - 2).toFixed(2) }
      // });
    }
  };

  const handleDelete = (e) => {

  }

  console.log("currApiDataSet =>", currApiDataSet)

  return (
    <>
      {/* <TableContainer component={Paper} style={style.TableContainer}>
        <Table sx={sxStyle.Table} aria-label="Currency table">
          <TableHead>
            <TableRow>
              <TableCell>Country Currency</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Change&nbsp;(24h)</TableCell>
            </TableRow>
          </TableHead>
          {currApiDataSet.length > 0 && <ExchangeRateTableData currApiDataSet={currApiDataSet} newCurrList={newCurrList} currApiKeyValuePair={currApiKeyValuePair} />}
        </Table>
      </TableContainer> */}

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={currLists}
          columns={columns}
          initialState={{ pinnedColumns: { right: ['actions'] } }}
        />
      </div>
      <CurrCountries sxStyle={sxStyle.CurrCountries} label="Add Currency" stateInputField="targetCurr" updateVal={handleChange} currApiArr={currApiArr} sx={{ ml: 20 }} />
    </>
  );
}

const columns = [
  { field: 'targetCurr', headerName: 'Country Currency', width: 230, editable: true },
  { field: 'lastestRate', headerName: 'Amount', type: 'number', width: 200, editable: true },
  { field: 'change', headerName: 'Change', type: 'number', width: 180, editable: true },
  {
    field: 'actions',
    type: 'actions',
    width: 100,
    getActions: () => [
      // <Button variant="outlined" type="button" className="delete" onClick={handleDelete} sx={{}} >{<DeleteIcon />}</Button>
      <Button variant="outlined" type="button" className="delete" >{<DeleteIcon />}</Button>
    ],
  },
];

const initialValue = {
  lastest: { baseCurr: "USD", rateDataSet: "lastest" },
  hist: { baseCurr: "USD", rateDataSet: "hist" },
};

const sxStyle = {
  Table: { width: 1 },
  CurrCountries: { minWidth: 200, width: 250 },
};

const style = {
  TableContainer: { marginBottom: "20px" },
  div: { display: "flex", alignItems: "center", },
  img: { margin: "0 10px 0px 0px" },
  span: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "3px" },
}

function checkIfExist(targetCurr, arr) {
  for (let el of arr) {
    if (el.targetCurr == targetCurr) return true;
  }
  return false;
}

function checkIsNumber(str) {
  return /^[0-9.]+$/.test(str);
}

function createCurrLists(baseCurr, targetCurr, currApiDataSet, currApiKeyValuePair) {
  let lastestRate;
  let histRate;
  let change;
  lastestRate = currApiDataSet[targetCurr];
  const currDisplay = (<div style={style.div}>
    <img
      style={style.img}
      src={`https://www.countryflagicons.com/SHINY/32/${targetCurr.substring(0, 2)}.png`}
      alt="" />
    <span style={style.span}>{currApiKeyValuePair[targetCurr]}</span>
  </div>);
  if (baseCurr !== targetCurr) {
    // lastestRate = currApiDataSet[0][targetCurr];
    // histRate = currApiDataSet[1][targetCurr];
    // console.log("histRate => ", histRate);
    // if (checkIsNumber(histRate)) {
    change = (lastestRate - histRate) * 100 / histRate;
    // } else {
    //   change = (Math.random() * 4) - 2;
    // }
    return { id: targetCurr, targetCurr: currDisplay, lastestRate, change: change.toFixed(2) };
  } else {
    return { id: targetCurr, targetCurr: currDisplay, lastestRate: 1, change: null };
  }
}