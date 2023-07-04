import './App.css';
import * as React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import MainNav from './components/MainNav';
import Convertor from './components/Convertor';
import ExchagneRateTable from './components/ExchangeRateTable';
import CurrOptionApiGetter from './components/CurrOptionApiGetter';

function App() {
  const {currOption, currKeyValue} = CurrOptionApiGetter();

  return (
    <div className="App">
      <MainNav />
      <Container maxWidth="m" sx={{ width: "100%", maxWidth: 1000, bgcolor: "background.paper", marginTop: "50px" }}>
        <Paper elevation={3} sx={{m:2, p:4}}>
          <Convertor currOption={currOption} />
        </Paper>
      </Container>
      <Container maxWidth="m" sx={{ width: "100%", maxWidth: 1000, bgcolor: "background.paper", marginTop: "50px" }}>
        <Paper elevation={3} sx={{m:2, p:4}}>
          <ExchagneRateTable currKeyValue={currKeyValue} currOption={currOption} />
        </Paper>
      </Container>
    </div>
  );
}

export default App;
