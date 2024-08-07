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
import { getUserPreferences, getUserIdentifier } from './util/userController';
import useInitialCurrListsGetter from './hook/useInitialCurrListsGetter.js';
import { retrieveFinancialNews } from "./util/apiClient";

export default function App() {
    const userId = getUserIdentifier();
    const [userPreference, setUserPreference] = useState(null);

    // console.log("APP() - userPreference: ", userPreference);
    const isDisplaySM = useMediaQuery('(max-width:414px)');
    const isDisplayMD = useMediaQuery('(max-width:920px)');
    const currentUrl = useLocation();
    const { currCountiesCodeMapDetail, sortedCurrsCodeList, validCurFlagList, isReady } = useCurrCountriesApiGetter();

    // retrieved initial data for live rate feature
    // need to retrieve outside here in order to prevent app re-fetch new initial data from backend whenever new theme is set
    // Observation: When react state in App.js is updated, all the sub component's state also reset
    const currentPath = currentUrl.pathname.toLowerCase();
    const isChartFeatureEnable = currentPath.includes("convert") || currentPath.includes("chart"); // If yes, Enable live rate's display chart feature and retrieve timeSeries instead of exchangeRates
    const { initialCurrLists, initialCurrExchangeRates, isReady: isCurrListReady } = useInitialCurrListsGetter(null, null, null, isChartFeatureEnable, userPreference); // retrieved initial exchange rate table list

    const [newsListsRes, setNewsListsRes] = useState({});

    // Initialized userPreference
    useEffect(() => {
        async function fetchPreference() {
            if (userPreference === null) {
                console.log("Get initial Pref!!!")
                const pref = await getUserPreferences(userId);
                const newsRes = await retrieveFinancialNews(pref.newsCategories);
                setUserPreference(pref);
                setNewsListsRes(newsRes.data);
            }
        }
        fetchPreference();
    }, [userId, userPreference])

    const Item = styled(Paper)(({ theme }) => ({
        height: 'auto',
        margin: isDisplaySM ? '20px' : '32px',
        padding: isDisplaySM ? '25px' : '32px', 
        background: "none"
    }));

    const MuiProps = {
        ...(userPreference !== null ? userPreference.theme === "outlined" ? outlinedProps : elevationProps : ""),
    }

    const handleThemeUpdate = async (newTheme) => {
        console.log("        # handle New Theme!!!");
        // setIsOutLineTheme(newTheme);
        const newPref = { ...userPreference };
        newPref.theme = newTheme === true ? "outlined" : 'elevation';
        setUserPreference(newPref);
    }

    const commonAttr = {
        displayFlags: { isDisplaySM, isDisplayMD },
        themeFlag: { isOutLineTheme: userPreference !== null ? userPreference.theme === "outlined" : "" },
        pref: { userId, userPreference, onThemeUpdate: handleThemeUpdate },
    }

    const attr = {
        navBar: { ...commonAttr.displayFlags, ...commonAttr.pref, currentUrl, ...commonAttr.themeFlag },
        curr: { ...commonAttr.displayFlags, ...commonAttr.pref, currCountiesCodeMapDetail, sortedCurrsCodeList, validCurFlagList, isChartFeatureEnable },
        chart: { initialCurrLists, initialCurrExchangeRates, isCurrListReady },
        news: { ...commonAttr.displayFlags, ...commonAttr.pref, currentUrl, newsListsRes }
    }

    const isOutLineTheme = userPreference !== null && userPreference.theme === "outlined";

    return (
        <>
            {userPreference !== null &&
                <ThemeProvider theme={lightTheme} >
                    <div className="App" >
                        <MainNav {...attr.navBar} />
                        <Box sx={{ minHeight: isDisplaySM ? '48vh' : '63vh', pt: isDisplaySM ? 7.5 : 8.5, pb: 0.5, backgroundColor: (theme) => theme.palette.mode === "light" ? "white" : "#272727" }}>
                            <Routes>
                                <Route exact path="/" element={
                                    <>
                                        <Item key="Convertor" {...MuiProps} sx={sxStyle}>
                                            {isReady ? <Convertor {...attr.curr} /> : <Loading />}
                                        </Item>
                                        <Item key="ExchangeRateTable" {...MuiProps} sx={sxStyle}>
                                            {isReady ? <ExchangeRateTable {...attr.curr} {...attr.chart} /> : <Loading />}
                                        </Item>
                                        <Item key="FinancialNews" {...MuiProps} sx={sxStyle}>
                                            {isReady ? <FinancialNews {...attr.news} /> : <Loading />}
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
                                        {isReady ? <ExchangeRateTable {...attr.curr} {...attr.chart} /> : <Loading />}
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
            }
        </>
    );
};

const sxStyle = {
    // backgroundColor: 'inherit',
    // color: 'inherit',
}

const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

const outlinedProps = {
    variant: 'outlined',
    square: true,
};

const elevationProps = {
    variant: 'elevation',
    elevation: 8,
};