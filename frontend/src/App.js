import './App.css';
import * as React from 'react';
import MainNav from './components/MainNav';
import Convertor from './components/Convertor';
import ExchangeRateTable from './components/ExchangeRateTable';
import CurrApiGetter from './components/CurrApiGetter';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

// TODO: Folder structure can help to prompt reader about the component hierarchy/grouping

export default function App() {
  // TODO: Not sure what the variables are supposed to be
  const {currApiArr, currApiKeyValuePair} = CurrApiGetter(); // TODO: Stick to naming convention. If it's a hook, name it "useHook()"

  return (
    <div className="App">
      <MainNav />
      {/* TODO: You can create default styled components for ease of reuse */}
      <Container maxWidth="m" sx={sxStyle.container}>
        <Paper elevation={3} sx={sxStyle.paper}>
          <Convertor currApiArr={currApiArr} />
        </Paper>
      </Container>
      <Container maxWidth="m" sx={sxStyle.container}>
        <Paper elevation={3} sx={sxStyle.paper}>
          <ExchangeRateTable currApiKeyValuePair={currApiKeyValuePair} currApiArr={currApiArr} />
        </Paper>
      </Container>
    </div>
  );
};

const sxStyle = {
  container: { width: "100%", maxWidth: 1000, bgcolor: "background.paper", marginTop: "50px" },
  paper: {m:2, p:4},
};