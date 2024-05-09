import MainNav from './components/MainNav';
import Convertor from './components/Convertor/Convertor';
import ExchangeRateTable from './components/ExchangeRateTable/ExchangeRateTable';
import useCurrCountriesApiGetter from './hook/useCurrCountriesApiGetter';
import { StyledPaperComponent } from './StyledComponents';
import FinancialNewsLists from './components/FinancialNews/FinancialNewsLists';
import { Routes, Route } from 'react-router-dom';
import { Loading } from './components/Loading';

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
                : <Loading />}
            </StyledPaperComponent>
            <StyledPaperComponent>
              {isReady ? <ExchangeRateTable currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
                : <Loading />}
            </StyledPaperComponent>
            <StyledPaperComponent>
              <FinancialNewsLists />
            </StyledPaperComponent>
          </>
        } ></Route>
        <Route path="/convertor/:curr?" element={
          <>
            <StyledPaperComponent>
              {isReady ? <Convertor currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
                : <Loading />}
            </StyledPaperComponent>
            <StyledPaperComponent>
              {isReady ? <ExchangeRateTable currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
                : <Loading />}
            </StyledPaperComponent>
          </>
        } ></Route>
        <Route exact path="/financial-news" element={
          <StyledPaperComponent>
            <FinancialNewsLists filter="true" />
          </StyledPaperComponent>
        } ></Route>
      </Routes>
    </div >
  );
};

