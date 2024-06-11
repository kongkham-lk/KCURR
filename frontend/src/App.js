import { useState } from 'react';
import MainNav from './components/MainNav';
import Convertor from './components/Convertor/Convertor';
import ExchangeRateTable from './components/ExchangeRateTable/ExchangeRateTable';
import useCurrCountriesApiGetter from './hook/useCurrCountriesApiGetter';
import FinancialNews from './components/FinancialNews/FinancialNews';
import { Routes, Route } from 'react-router-dom';
import { Loading } from './components/Loading';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

export default function App() {
    const [isOutLineTheme, setIsOutLineTheme] = useState(false); // setting theme
    const isDisplaySM = useMediaQuery('(max-width:414px)');
    const isDisplayMD = useMediaQuery('(max-width:920px)');
    const { currCountiesCodeMapDetail, isReady } = useCurrCountriesApiGetter();

    const Item = styled(Paper)(({ theme }) => ({
        height: 'auto',
        margin: isDisplaySM ? '20px' : '32px',
        padding: isDisplaySM ? '25px' : '32px'
    }));

    const lightTheme = createTheme({ palette: { mode: 'light' } });

    const outlinedProps = {
        variant: 'outlined',
        square: true,
    };

    const elevationProps = {
        variant: 'elevation',
        elevation: 8,
    };

    const handleThemeChange = (event) => {
        setIsOutLineTheme(event);
    }

    return (
        <div className="App">
            <MainNav isDisplaySM={isDisplaySM} isOutLineTheme={isOutLineTheme} onChangeTheme={handleThemeChange} />
            <ThemeProvider theme={lightTheme}>
                <Routes>
                    <Route exact path="/" element={
                        <>
                            <Item key="Convertor" {...(isOutLineTheme ? outlinedProps : elevationProps)}>
                                {isReady ? <Convertor currCountiesCodeMapDetail={currCountiesCodeMapDetail} isDisplaySM={isDisplaySM} />
                                    : <Loading />}
                            </Item>
                            <Item key="ExchangeRateTable" {...(isOutLineTheme ? outlinedProps : elevationProps)}>
                                {isReady ? <ExchangeRateTable currCountiesCodeMapDetail={currCountiesCodeMapDetail} isDisplaySM={isDisplaySM} isDisplayMD={isDisplayMD} />
                                    : <Loading />}
                            </Item>
                            <Item key="FinancialNews" {...(isOutLineTheme ? outlinedProps : elevationProps)}>
                                <FinancialNews isDisplaySM={isDisplaySM} isOutLineTheme={isOutLineTheme} />
                            </Item>
                        </>
                    } ></Route>
                    <Route path="/convertor/:curr?" element={
                        <>
                            <Item key="Convertor" {...(isOutLineTheme ? outlinedProps : elevationProps)}>
                                {isReady ? <Convertor currCountiesCodeMapDetail={currCountiesCodeMapDetail} isDisplaySM={isDisplaySM} />
                                    : <Loading />}
                            </Item>
                            <Item key="ExchangeRateTable" {...(isOutLineTheme ? outlinedProps : elevationProps)}>
                                {isReady ? <ExchangeRateTable currCountiesCodeMapDetail={currCountiesCodeMapDetail} isDisplaySM={isDisplaySM} isDisplayMD={isDisplayMD} />
                                    : <Loading />}
                            </Item>
                        </>
                    } ></Route>
                    <Route exact path="/financial-news" element={
                        <Item key="FinancialNews" {...(isOutLineTheme ? outlinedProps : elevationProps)}>
                            <FinancialNews filter="true" isDisplaySM={isDisplaySM} isOutLineTheme={isOutLineTheme} />
                        </Item>
                    } ></Route>
                </Routes>
            </ThemeProvider>
        </div >
    );
};