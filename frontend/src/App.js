import MainNav from './components/MainNav';
import Convertor from './components/Convertor/Convertor';
import ExchangeRateTable from './components/ExchangeRateTable/ExchangeRateTable';
import useCurrCountriesApiGetter from './hook/useCurrCountriesApiGetter';
import { StyledPaperComponent } from './StyledComponents';
import FinancialNewsLists from './components/FinancialNews/FinancialNewsLists';
import { Routes, Route } from 'react-router-dom';
import { Loading } from './components/Loading';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

export default function App() {
  const isMobileScreen = useMediaQuery('(max-width:414px)');
  const { currCountiesCodeMapDetail, isReady } = useCurrCountriesApiGetter();

  const Item = styled(Paper)(({ theme }) => ({
    height: 'auto',
    margin: isMobileScreen ? '20px' : '32px',
    padding: isMobileScreen ? '25px' : '32px'
  }));

  const lightTheme = createTheme({ palette: { mode: 'light' } });
  const elevateLevel = 8;

  return (
    <div className="App">
      <MainNav /> 
      <ThemeProvider theme={lightTheme}>
        <Routes>
          <Route exact path="/" element={
            <>
              <Item key="Convertor" elevation={elevateLevel}>
                {isReady ? <Convertor currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
                  : <Loading />}
              </Item>
              <Item key="ExchangeRateTable" elevation={elevateLevel}>
                {isReady ? <ExchangeRateTable currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
                  : <Loading />}
              </Item>
              <Item key="FinancialNewsLists" elevation={elevateLevel}>
                <FinancialNewsLists />
              </Item>
            </>
          } ></Route>
          <Route path="/convertor/:curr?" element={
            <>
              <Item key="Convertor" elevation={elevateLevel}>
                {isReady ? <Convertor currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
                  : <Loading />}
              </Item>
              <Item key="ExchangeRateTable" elevation={elevateLevel}>
                {isReady ? <ExchangeRateTable currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
                  : <Loading />}
              </Item>
            </>
          } ></Route>
          <Route exact path="/financial-news" element={
            <Item key="FinancialNewsLists" elevation={elevateLevel}>
              <FinancialNewsLists filter="true" />
            </Item>
          } ></Route>
        </Routes>
      </ThemeProvider>
    </div >
  );
};

