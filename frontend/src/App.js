import { useEffect, useState } from 'react';
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
import { getUserPreferences, getUserIdentifier, saveUserPreferences } from './util/userController';

export default function App() {
    const userId = getUserIdentifier();
    const [userPreference, setUserPreference] = useState({});

    console.log("APP() - userPreference: ", userPreference);
    const isDisplaySM = useMediaQuery('(max-width:414px)');
    const isDisplayMD = useMediaQuery('(max-width:920px)');
    const currentUrl = useLocation();
    const { currCountiesCodeMapDetail, sortedCurrsCodeList, validCurFlagList, isReady } = useCurrCountriesApiGetter();

    useEffect(() => {
        async function fetchPreference() {
            const pref = await getUserPreferences(userId);
            // console.log("Return Pref: ", pref)
            setUserPreference(pref);
        }
        fetchPreference();
    }, [])

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
        ...(userPreference.theme === "outlined" ? outlinedProps : elevationProps),
    }

    const handlePreferenceUpdateToAPI = async (newPreference) => {
        // console.log("handle New Preference!!!");
        await saveUserPreferences(userId, newPreference);
        setUserPreference(newPreference);
    }

    const handleNewsCategoriesChange = (event) => {
        const newPreference = { ...userPreference };
        newPreference.newsCategories = [...event];
        console.log("Save new NewsCategories List!!!");
        setUserPreference(newPreference);
    }

    const commonAttr = {
        displayFlags: { isDisplaySM, isDisplayMD },
        themeFlag: { isOutLineTheme: userPreference.theme === "outlined" },
        pref: { userPreference, onPreferenceUpdateToAPI: handlePreferenceUpdateToAPI },
    }

    const attr = {
        navBar: { ...commonAttr.displayFlags, ...commonAttr.pref, currentUrl, ...commonAttr.themeFlag },
        curr:   { ...commonAttr.displayFlags, ...commonAttr.pref, currentUrl, currCountiesCodeMapDetail, sortedCurrsCodeList, validCurFlagList },
        news:   { ...commonAttr.displayFlags, ...commonAttr.pref, currentUrl, ...commonAttr.themeFlag }
    }

    return (
        <ThemeProvider theme={lightTheme} >
            <div className="App" >
                <MainNav {...attr.navBar} />
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
                                    {isReady ? <FinancialNews {...attr.news} onNewsCategoriesUpdate={handleNewsCategoriesChange} /> : <Loading />}
                                </Item>
                            </>
                        } ></Route>
                        <Route exact path="/Convertor" element={
                            <Item key="Convertor" {...MuiProps} sx={sxStyle}>
                                {isReady ? <Convertor {...attr.curr} /> : <Loading />}
                            </Item>
                        } ></Route>
                        <Route exact path="/Chart" element={
                            <Item key="ExchangeRateTable" {...MuiProps} sx={sxStyle}>
                                {isReady ? <ExchangeRateTable {...attr.curr} /> : <Loading />}
                            </Item>
                        } ></Route>
                        <Route exact path="/News" element={
                            <Item key="FinancialNews" {...MuiProps} sx={sxStyle}>
                                <FinancialNews filter="true" {...attr.news} onNewsCategoriesUpdate={handleNewsCategoriesChange} />
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