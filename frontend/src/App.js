import './App.css';
import MainNav from './components/MainNav';
import Convertor from './components/Convertor/Convertor';
import ExchangeRateTable from './components/ExchangeRateTable/ExchangeRateTable';
import useCurrCountriesApiGetter from './components/Hook/useCurrCountriesApiGetter';
import { StyledPaperComponent } from './StyledComponents';

export default function App() {
  const { currCountiesCodeMapDetail, isReady } = useCurrCountriesApiGetter;

  return (
    <div className="App">
      <MainNav />
      <StyledPaperComponent>
        {isReady ? <Convertor currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
          : <div className="loader"><div style={style.div}>Loading...</div></div>}
      </StyledPaperComponent>
      <StyledPaperComponent>
        {isReady ? <ExchangeRateTable currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
          : <div className="loader"><div style={style.div}>Loading...</div></div>}
      </StyledPaperComponent>
    </div>
  );
};

const style = {
  div: { margin: "0 7px -6px 0" },
}