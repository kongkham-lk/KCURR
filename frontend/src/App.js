import './App.css';
import MainNav from './components/MainNav';
import Convertor from './components/Convertor/Convertor';
import ExchangeRateTable from './components/ExchangeRateTable/ExchangeRateTable';
import useCurrCountriesApiGetter from './hook/useCurrCountriesApiGetter';
import { StyledPaperComponent } from './StyledComponents';
import FinancialNewsLists from './components/FinancialNews/FinancialNewsLists';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  const { currCountiesCodeMapDetail, isReady } = useCurrCountriesApiGetter();

  return (
    <div className="App">
      <MainNav />
      <Routes>
        <Route exact path="/" element={
          <>
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
          </>
        } ></Route>
        <Route exact path="/convertor" element={
          <>
            <StyledPaperComponent>
              {isReady ? <Convertor currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
                : <div className="loader"></div>}
            </StyledPaperComponent>
            <StyledPaperComponent>
              {isReady ? <ExchangeRateTable currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
                : <div className="loader"></div>}
            </StyledPaperComponent>
          </>
        } ></Route>
        <Route exact path="/financial-news" element={
          <StyledPaperComponent>
            <FinancialNewsLists />
          </StyledPaperComponent>
        } ></Route>
      </Routes>
    </div >
  );
};