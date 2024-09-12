import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import useCurrCountriesApiGetter from './hook/useCurrCountriesApiGetter';
import useInitialCurrListsApiGetter from './hook/useInitialCurrListsApiGetter';
import { getUserPreferences, getUserIdentifier } from './hook/userController';
import MainNav from './components/MainNav';
import Convertor from './components/Convertor/Convertor';
import ExchangeRateTable from './components/ExchangeRateTable/ExchangeRateTable';
import FinancialNews from './components/FinancialNews/FinancialNews';
import Footer from './components/Footer';
import { Loading } from './components/subComponents/Loading';
import { retrieveFinancialNews } from "./util/apiClient";
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { type NewsHeadlines, type Preference } from './lib/types';

export default function App() {
    const userId: string = getUserIdentifier();
    const [userPreference, setUserPreference] = useState<Preference | null>(null);
    const isDisplaySM: boolean = useMediaQuery('(max-width:414px)');
    const isDisplayMD: boolean = useMediaQuery('(max-width:920px)');
    const currentUrl = useLocation();
    const currentPath: string = currentUrl.pathname.toLowerCase();
    const isChartFeatureEnable: boolean = currentPath.includes("convert") || currentPath.includes("chart"); // If yes, Enable live rate's display chart feature and retrieve timeSeries instead of exchangeRates
    const { currCountiesCodeMapDetail, sortedCurrsCodeList, validCurFlagList, isReady } = useCurrCountriesApiGetter();

    // console.log("APP() - userPreference: ", userPreference);

    // retrieved initial data for live rate feature
    // need to retrieve outside here in order to prevent app re-fetch new initial data from backend whenever new theme is set
    // Observation: When react state in App.js is updated, all the sub component's state also reset
    const { initialCurrLists, initialCurrExchangeRates, isReady: isCurrListReady } = useInitialCurrListsApiGetter("", [], "", isChartFeatureEnable, userPreference, userId); // retrieved initial exchange rate table list
    const [newsListsRes, setNewsListsRes] = useState<NewsHeadlines[]>([]);

    // Initialized userPreference
    useEffect(() => {
        async function fetchPreference() {
            if (userPreference === null) {
                // console.log("Get initial Pref!!!")
                const pref: Preference | null = await getUserPreferences(userId);
                if (pref !== null) {
                    const newsRes = await retrieveFinancialNews(pref.newsCategories);
                    setUserPreference(pref);

                    if (newsRes !== null)
                        setNewsListsRes(newsRes.data);
                }
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
        ...(userPreference !== null ? userPreference.theme === "color" ? elevationProps : outlinedProps : ""),
    }

    const handleThemeUpdate = async (newTheme: string): Promise<void> => {
        console.log("        # handle New Theme!!!");
        const newPref: Preference | null = await getUserPreferences(userId);
        if (newPref !== null) {
            newPref.theme = newTheme;
            setUserPreference(newPref);
        }
    }

    const commonAttr = {
        displayFlags: { isDisplaySM, isDisplayMD },
        themeFlag: { isOutLineTheme: userPreference !== null && userPreference.theme !== "color" },
        pref: { userId, userPreference, onThemeUpdate: handleThemeUpdate },
    }

    const attr = {
        navBar: { ...commonAttr.displayFlags, ...commonAttr.pref, currentPath, ...commonAttr.themeFlag },
        curr: { ...commonAttr.displayFlags, ...commonAttr.pref, currCountiesCodeMapDetail, sortedCurrsCodeList, validCurFlagList, isChartFeatureEnable },
        chart: { initialCurrLists, initialCurrExchangeRates, isReady: isCurrListReady },
        news: { ...commonAttr.displayFlags, ...commonAttr.pref, newsListsRes },
        footer: {...commonAttr.displayFlags, ...commonAttr.themeFlag, userPreference}
    }

    const isDarkTheme = userPreference !== null ? userPreference.theme === "dark" : false; // set default theme as white theme
    const targetTheme = isDarkTheme ? darkTheme : lightTheme;

    return (
        <>
            {userPreference !== null &&
                <ThemeProvider theme={targetTheme} >
                    <div className="App" >
                        <MainNav {...attr.navBar} />
                        <Box
                            sx={{
                                minHeight: isDisplaySM ? '48vh' : '63vh',
                                pt: isDisplaySM ? 7.5 : 8.5,
                                pb: 0.5,
                                backgroundColor: (theme) => theme.palette.mode === "light" ? "white" : "#272727"
                            }}>
                            <Routes>
                                <Route path="/" element={
                                    <>
                                        <Item key="Convertor" {...MuiProps} >
                                            {isReady ? <Convertor {...attr.curr} /> : <Loading />}
                                        </Item>
                                        <Item key="ExchangeRateTable" {...MuiProps} >
                                            {isReady ? <ExchangeRateTable {...attr.curr} {...attr.chart} /> : <Loading />}
                                        </Item>
                                        <Item key="FinancialNews" {...MuiProps} >
                                            {isReady ? <FinancialNews {...attr.news} /> : <Loading />}
                                        </Item>
                                    </>
                                } ></Route>
                                <Route path="/Convertor" element={
                                    <Item key="Convertor" {...MuiProps} >
                                        {isReady ? <Convertor {...attr.curr} /> : <Loading />}
                                    </Item>
                                } ></Route>
                                <Route path="/Chart" element={
                                    <Item key="ExchangeRateTable" {...MuiProps} >
                                        {isReady ? <ExchangeRateTable {...attr.curr} {...attr.chart} /> : <Loading />}
                                    </Item>
                                } ></Route>
                                <Route path="/News" element={
                                    <Item key="FinancialNews" {...MuiProps} >
                                        <FinancialNews filter={true} {...attr.news} />
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