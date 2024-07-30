import { useState } from 'react';
import MainNav from './components/MainNav';
import Convertor from './components/Convertor/Convertor';
import ExchangeRateTable from './components/ExchangeRateTable/ExchangeRateTable';
import useCurrCountriesApiGetter from './hook/useCurrCountriesApiGetter';
import FinancialNews from './components/FinancialNews/FinancialNews';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Loading } from './components/subComponents/Loading';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Footer from './components/Footer';
import { Box } from '@mui/material';

export default function App() {
    const [isOutLineTheme, setIsOutLineTheme] = useState(false); // setting theme

    const isDisplaySM = useMediaQuery('(max-width:414px)');
    const isDisplayMD = useMediaQuery('(max-width:920px)');
    const currentUrl = useLocation();
    const { currCountiesCodeMapDetail, sortedCurrsCodeList, validCurFlagList, isReady } = useCurrCountriesApiGetter();

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

    const MuiProps = {
        ...(isOutLineTheme ? outlinedProps : elevationProps),
    }

    const handleThemeChange = (event) => {
        setIsOutLineTheme(event);
    }

    const commonAttr = {
        themeFlags: { isOutLineTheme },
        displayFlags: { isDisplaySM, isDisplayMD },
    }

    const attr = {
        navBar: { ...commonAttr.displayFlags, ...commonAttr.themeFlags, currentUrl },
        curr: { currCountiesCodeMapDetail, sortedCurrsCodeList, validCurFlagList, ...commonAttr.displayFlags, currentUrl },
        news: { ...commonAttr.themeFlags, ...commonAttr.displayFlags, currentUrl }
    }

    return (
        <ThemeProvider theme={lightTheme} >
            <div className="App" >
                <MainNav {...attr.navBar} onChangeTheme={handleThemeChange}/>
                <Box sx={{ minHeight: isDisplaySM ? '48vh' : '63vh', pt: isDisplaySM ? 7.5 : 8.5, pb: 0.5 }}>
                    <Routes>
                        <Route exact path="/" element={
                            <>
                                <Item key="Convertor" {...MuiProps} sx={sxStyle}>
                                    {isReady ? <Convertor {...attr.curr} /> : <Loading />}
                                </Item>
                                <Item key="ExchangeRateTable" {...MuiProps} sx={sxStyle}>
                                    {isReady ? <ExchangeRateTable {...attr.curr} /> : <Loading />}
                                </Item>
                                <Item key="FinancialNews" {...MuiProps} sx={sxStyle}>
                                    {isReady ? <FinancialNews {...attr.news} /> : <Loading />}
                                </Item>
                            </>
                        } ></Route>
                        <Route path="/Convertor/:curr?" element={
                            <Item key="Convertor" {...MuiProps} sx={sxStyle}>
                                {isReady ? <Convertor {...attr.curr} /> : <Loading />}
                            </Item>
                        } ></Route>
                        <Route path="/Chart" element={
                            <Item key="ExchangeRateTable" {...MuiProps} sx={sxStyle}>
                                {isReady ? <ExchangeRateTable {...attr.curr} /> : <Loading />}
                            </Item>
                        } ></Route>
                        <Route exact path="/News" element={
                            <Item key="FinancialNews" {...MuiProps} sx={sxStyle}>
                                <FinancialNews filter="true" {...attr.news} />
                            </Item>
                        } ></Route>
                    </Routes>
                </Box>
                <Footer {...attr.navBar} />
            </div >
        </ThemeProvider>
    );
};

const sxStyle = {
    backgroundColor: 'inherit',
    color: 'inherit',
}