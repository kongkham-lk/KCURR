import './App.css';
import * as React from 'react';
import MainNav from './components/MainNav';
import Convertor from './components/Convertor';
import ExchangeRateTable from './components/ExchangeRateTable';
import CurrCountriesApiGetter from './components/CurrCountriesApiGetter';
import { StyledPaperComponent } from './StyledComponents';

export default function App() {
  const { currApiKeyValuePair, isReady } = CurrCountriesApiGetter();

  return (
    <div className="App">
      <MainNav />
      <StyledPaperComponent>
        {isReady ? <Convertor currApiKeyValuePair={currApiKeyValuePair} />
          : <div className="loader"><div style={style.div}>Loading...</div></div>}
      </StyledPaperComponent>
      <StyledPaperComponent>
        {isReady ? <ExchangeRateTable currApiKeyValuePair={currApiKeyValuePair} />
          : <div className="loader"><div style={style.div}>Loading...</div></div>}
      </StyledPaperComponent>
    </div>
  );
};

const style = {
  div: { margin: "0 7px -6px 0" },
}