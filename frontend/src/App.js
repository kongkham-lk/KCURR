import './App.css';
import MainNav from './components/MainNav';
import Convertor from './components/Convertor/Convertor';
import ExchangeRateTable from './components/ExchangeRateTable/ExchangeRateTable';
import useCurrCountriesApiGetter from './hook/useCurrCountriesApiGetter';
import { StyledPaperComponent } from './StyledComponents';
import FinancialNewsLists from './components/FinancialNews/FinancialNewsLists';

export default function App() {
  const { currCountiesCodeMapDetail, isReady } = useCurrCountriesApiGetter();

  return (
    <div className="App">
      <MainNav />
      <StyledPaperComponent>
        {isReady ? <Convertor currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
          : <div className="loader"></div>}
      </StyledPaperComponent>
      <StyledPaperComponent>
        {isReady ? <ExchangeRateTable currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
          : <div className="loader"></div>}
      </StyledPaperComponent>
      <StyledPaperComponent>
        <FinancialNewsLists />
      </StyledPaperComponent>
    </div>
  );
};