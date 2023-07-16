import './App.css';
import * as React from 'react';
import MainNav from './components/MainNav';
import Convertor from './components/Convertor';
import ExchangeRateTable from './components/ExchangeRateTable';
import CurrCountriesApiGetter from './components/CurrCountriesApiGetter';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

export default function App() {
  const { currApiKeyValuePair, isReady } = CurrCountriesApiGetter();

  return (
    <div className="App">
      <MainNav />
      <Container maxWidth="m" sx={sxStyle.container}>
        <Paper elevation={3} sx={sxStyle.paper}>
          {isReady ? <Convertor currApiKeyValuePair={currApiKeyValuePair} />
            : <div class="loader"><div style={{ margin: "0 7px -6px 0" }}>Loading...</div></div>}
        </Paper>
      </Container>
      <Container maxWidth="m" sx={sxStyle.container}>
        <Paper elevation={3} sx={sxStyle.paper}>
          {isReady ? <ExchangeRateTable currApiKeyValuePair={currApiKeyValuePair} />
            : <div class="loader"><div style={{ margin: "0 7px -6px 0" }}>Loading...</div></div>}
        </Paper>
      </Container>
    </div>
  );
};

const sxStyle = {
  container: { width: "100%", maxWidth: 1000, bgcolor: "background.paper", marginTop: "50px" },
  paper: { m: 2, p: 4 },
};