import '../../App.css';
import React, { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import CurrCountriesDropDown from '../subComponents/CurrCountriesDropDown';
import EnhancedTableHead from './EnhancedTableHead';
import {
    getComparator, stableSort, styleTableCell, styleTableRow, getDisplayList, styleTableRowInFile,
    styleTableCellDelete, getDayRangeDate, getMonthRangeDate
} from '../../util/ExchangeRateTableDataUtil';
import { checkIfExist } from '../../util/checkingMethods';
import { createCurrLists } from '../../util/createCurrLists';
import { getFlag } from '../../util/getFlag';
import { retrieveExchangeRates } from '../../util/apiClient';
import { LineGraph } from '../subComponents/LineGraph';
import CircularProgressWithLabel from '../subComponents/CircularProgressWithLabel';
import TransitionAppendChart from '../subComponents/TransitionAppendChart';
import { getCurrListsFromCookie, getUserPreferences, saveCurrListsToCookie, savePrefCurrCodes } from '../../hook/userController';
import { getBaseColor } from '../../util/globalVariable';
import {
    type NewCurrCodeAssigned, type Preference, type CurrCodeMapExchangeRates, type CurrCountriesApi,
    type CurrList, type DisplayFlags, type User, type Order
} from '../../lib/types';
import { SxProps, Theme } from '@mui/system';

type ExchangeRateTableProps = CurrCountriesApi & DisplayFlags & Omit<User, "onThemeUpdate"> & {
    initialCurrLists: CurrList[];
    initialCurrExchangeRates: CurrCodeMapExchangeRates[] | null;
    isChartFeatureEnable: boolean;
}

export default function ExchangeRateTable(props: ExchangeRateTableProps) {
    const { currCountiesCodeMapDetail, validCurFlagList, sortedCurrsCodeList, isDisplaySM, isDisplayMD, userId,
        userPreference, initialCurrLists, initialCurrExchangeRates, isReady, isChartFeatureEnable } = props;
    // Setting property base on save preference
    const [currCodeArray, setCurrCodeArray] = useState(
        userPreference !== null && userPreference.liveRateCurrCodes !== undefined
            ? [...userPreference.liveRateCurrCodes] : []
    ); // initial currency list that will be displayed on screen
    const [defaultCurrCode, setDefaultCurrCode] = useState(currCodeArray[0]); // set default/main currency that will be used to against the other target currency

    // Initialized currency's visible row proeprty
    const [defaultCurrExchangeRates, setDefaultCurrExchangeRates] = useState(
        initialCurrExchangeRates !== null ? [...initialCurrExchangeRates] : null
    ); // consist of all the currCode exchange rate, 1 day range. Do not set anything if currently load feature page
    const [currLists, setCurrLists] = useState([...initialCurrLists]);

    // Mui table's setting property
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Display time of the latest fetch update from APIs
    const [lastUpdateRateTime, setLastUpdateRateTime] = useState("");
    const [triggerNewTimeDisplay, setTriggerNewTimeDisplay] = useState(false);

    // Initialized time property
    const timeSeriesRangeLength = "1d"; // time range for displaying chart on the live rate table
    const [dayRangeIndicator] = useState([getDayRangeDate(1), getDayRangeDate(0)]); // needed when the live rate table use exchange rate data instead of timeSeries
    const [monthRangeIndicator] = useState([getMonthRangeDate(1), getMonthRangeDate(0)]); // needed when the live rate table use exchange rate data instead of timeSeries

    // Initialized flags
    const [newCurrCode, setNewCurrCode] = useState(""); // new added currency flag
    const [displayRateHistChartFlags, setDisplayRateHistChartFlags] = useState(
        userPreference !== null && userPreference.liveRateCurrCodes !== undefined
            ? [...Array(userPreference.liveRateCurrCodes.length)].map(i => false) : []
    ); // each live rate row's display chart flags
    const [prevDisplayChartIndex, setPrevDisplayChartIndex] = useState(-1); // each live rate row's display chart flags
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const isDarkTheme = userPreference !== null && userPreference.theme === "dark";
    const emptyRows = page > 0 && currLists !== null ? Math.max(0, (1 + page) * rowsPerPage - currLists.length) : 0;
    // console.log("--  >>> Load Live Rate Table!!! ", initialCurrLists, currLists)

    const visibleRows = useMemo(
        () =>
            currLists !== null
                ? stableSort(currLists, getComparator(order, orderBy)).slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage,
                )
                : [],
        [currLists, order, orderBy, page, rowsPerPage],
    );

    useEffect(() => {
        if (isReady) {
            handleDisplayLatestFetchTimeUpdate();
        }
    }, [isReady]);

    // Fetch the latest CurrCodeArray and CurrLists from cookie.
    // This is needed since react fetch all all the neccessary data once, where the new update will be brought along 
    // when user switch to different tab.
    useEffect(() => {
        async function fetchUpdateOnInitialLoad() {
            if (isInitialLoad) {
                const newPref: Preference | null = await getUserPreferences(userId);
                const newCurrLists = await getCurrListsFromCookie(userId);

                // return null only when fail to get user preferece from backend
                if (newPref !== null) {
                    const newCurrCodeArray = newPref.liveRateCurrCodes;
                    setCurrCodeArray(newCurrCodeArray !== undefined ? newCurrCodeArray : currCodeArray);
                }

                // if cookie return null, that's mean this is first visited KCURR user, DO NOT update anything
                if (newCurrLists !== null)
                    setCurrLists(newCurrLists);

                setIsInitialLoad(false);
            }
        }
        fetchUpdateOnInitialLoad();
    }, [currCodeArray, isInitialLoad, userId])

    // Update new added currency code to visible row
    useEffect(() => {
        async function checkNewRow() {
            // console.log("refresh page!!!");
            if (newCurrCode !== "" && !checkIfExist(currLists, newCurrCode)) {
                updateCurrCodeArray()
                await updateCurrLists()
            }
            setNewCurrCode("");
            // console.log("Check Curr Lists after refresh page: ", currLists);
            // console.log("Check Curr Array after refresh page: ", currCodeArray);
        }
        checkNewRow();
    }, [newCurrCode, currLists, defaultCurrExchangeRates, defaultCurrCode, currCodeArray, isChartFeatureEnable, userId]);

    // refresh time display on screen when any time-related property is updated
    useEffect(() => {
        if (triggerNewTimeDisplay) {
            console.log("Update new display time!!!");
            handleDisplayLatestFetchTimeUpdate();
            setTriggerNewTimeDisplay(false)
        }
    }, [triggerNewTimeDisplay]);

    const updateCurrCodeArray = (): void => {
        const newCurrCodeArray = [...currCodeArray, newCurrCode];
        setCurrCodeArray(newCurrCodeArray);
        handleCurrCodeArrayCookieUpdate(newCurrCodeArray);
    }

    const updateCurrLists = async (): Promise<void> => {
        console.log("    >>> createCurrLists!!!")
        const currList = await createCurrLists(defaultCurrCode, newCurrCode, defaultCurrExchangeRates, timeSeriesRangeLength, isChartFeatureEnable);
        const newLists = [...currLists, currList];
        setCurrLists(newLists);
        saveCurrListsToCookie(userId, newLists);
    }

    const handleRequestSort = (event: any, property: string): void => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleDisplayLatestFetchTimeUpdate = () => {
        const newDate = new Date();
        const updateTime = newDate.toDateString().slice(4, -5) + ", " + newDate.toDateString().slice(-5) + ", "
            + newDate.toLocaleTimeString('en-US', { hour12: false }).slice(0, -3);
        setLastUpdateRateTime(updateTime);
    }

    // Re-arrange curr list order
    const handleSetDefaultCurr = async (targetCurr: string) => {
        // get the index of new default curr
        const targetCurrIndex = currLists.findIndex(curr => curr.targetCurr === targetCurr);

        // Do nth if new default currency is not exist or already set as default currency
        if (targetCurrIndex > -1 && targetCurrIndex !== 0) {
            // console.log("Rearrage list!!!");
            // Copy the target currency to the front and construct the new array in one step
            const newCurrCodeArray = [
                currCodeArray[targetCurrIndex],
                ...currCodeArray.slice(0, targetCurrIndex),
                ...currCodeArray.slice(targetCurrIndex + 1)
            ];

            // console.log("Check Array after re-arrange:  ", oldTargetCurrArray);
            await handleUpdateDefaultCurrLiveRate(newCurrCodeArray); // Refetch new update rate from beacon api

            if (userPreference !== null)
                userPreference.liveRateCurrCodes = newCurrCodeArray;

            setDefaultCurrCode(targetCurr);
            setCurrCodeArray(newCurrCodeArray);
            handleCurrCodeArrayCookieUpdate(newCurrCodeArray);
        }
    };

    // Refetch new default currency rate from api
    const handleUpdateDefaultCurrLiveRate = async (currCodeArray: string[]) => {
        // console.log("Fetching latest exchange rate from API!!!")
        const newLists: CurrList[] = [];
        const initialValue = { baseCurr: currCodeArray[0] };
        const newDefaultCurrExchangeRates = await retrieveExchangeRates(initialValue); // Update exchange rate from API

        for (let i in currCodeArray) {
            // console.log("    >>> createCurrLists!!!")
            newLists[i] = await createCurrLists(currCodeArray[0], currCodeArray[i], newDefaultCurrExchangeRates,
                timeSeriesRangeLength, isChartFeatureEnable);
        }

        setDefaultCurrExchangeRates(newDefaultCurrExchangeRates);
        setCurrLists(newLists);
        saveCurrListsToCookie(userId, newLists);
        handleDisplayLatestFetchTimeUpdate();
    };

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const updateNewLiveRate = () => {
        // console.log("Timer trigger!!!")
        handleUpdateDefaultCurrLiveRate(currCodeArray);
    };

    const handleAddCurrCountry = (e: NewCurrCodeAssigned) => {
        console.log("Add new item to list: ", e);
        setNewCurrCode(e.value);
    };

    const handleDelete = (targetCurr: string) => {
        if (targetCurr === currCodeArray[0]) {
            // console.log("Attempting to delete default currency row, Exit!!!");
            return;
        }

        // console.log("Delete an item to list: ", targetCurr);
        const newCurrLists = [...currLists];
        const newCurrCodeArray = [...currCodeArray];

        for (let i = 0; i < newCurrLists.length; i++) {
            // only delete the currency in the list that match targetCurr, but not defaultCurr 
            if (newCurrLists[i].targetCurr === targetCurr && targetCurr !== defaultCurrCode) {
                newCurrLists.splice(i, 1);
                newCurrCodeArray.splice(i, 1);
            }
        }
        setCurrLists(newCurrLists);
        saveCurrListsToCookie(userId, newCurrLists);
        setCurrCodeArray(newCurrCodeArray);
        handleCurrCodeArrayCookieUpdate(newCurrCodeArray);
    }

    const handleCurrCodeArrayCookieUpdate = (newCurrCodeArray: string[]) => {
        console.log("Save new currCodeArray to API!!! ", newCurrCodeArray);
        savePrefCurrCodes(userId, newCurrCodeArray);
    }

    const handleResetFilter = () => setOrderBy('');

    const attr = {
        CurrCountriesDropDown: {
            label: "Add Currency",
            inputCurrType: "targetCurr",
            currCountiesCodeMapDetail,
            passInStyle: { ...style.CurrCountriesDropDown },
            // size: "small", // no need to pass in as this somehow won't effect the conversion secton
            sortedCurrsCodeList,
            validCurFlagList,
        },
        CircularProgressWithLabel: {
            ...sxStyle.progressBar,
            lastUpdateRateTime,
            isDisplaySM,
            isDisplayMD,
        },
        RateHistoryGraph: {
            passInRequestState: true,
            ...props
        },
    };

    const handleToggleFlags = (index: number, isDefaultCurr: boolean) => {
        if (isDefaultCurr)
            return;

        if (isChartFeatureEnable) {
            const newAppendCharts = [...displayRateHistChartFlags];

            if (newAppendCharts[index])
                newAppendCharts[index] = false;
            else {
                newAppendCharts[index] = true;

                if (prevDisplayChartIndex !== index) {
                    if (prevDisplayChartIndex !== -1) // close the prev display chart and display the current row's chart
                        newAppendCharts[prevDisplayChartIndex] = false;
                    setPrevDisplayChartIndex(index);
                }
            }
            setDisplayRateHistChartFlags([...newAppendCharts]);
        }
    };

    return (
        <>
            {isReady && <Box sx={sxStyle.Box} >
                <Paper sx={sxStyle.Paper} >
                    <div style={style.PaperDiv}>
                        <Typography
                            sx={sxStyle.Typography}
                            variant="h5"
                            id="tableTitle"
                            component="div"
                        >
                            {getTargetProps(isDisplaySM).displayText}
                        </Typography>
                        {!isDisplaySM &&
                            <Tooltip
                                title="Reset Filter"
                                sx={getTargetProps(isDisplaySM).margin}
                                onClick={handleResetFilter}>
                                <IconButton>
                                    <FilterListOffIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    </div>
                    <TableContainer sx={isDisplaySM ? style.marginTop : style.NoGapTableContainer}>
                        <Table
                            sx={isDisplaySM ? sxStyle.Table.sm : sxStyle.Table.lg}
                            aria-labelledby="tableTitle"
                            size='medium'
                        >
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={currLists !== null ? currLists.length : 0}
                                isDisplaySM={isDisplaySM}
                            />
                            <TableBody sx={sxStyle.TableBody}>
                                {visibleRows.map((currList: CurrList, index: number) => {
                                    const targetCurrCode = currList.targetCurr;
                                    const currencyRateData = {
                                        baseCurr: currCodeArray[0],
                                        targetCurr: currList.targetCurr,
                                        amount: 0,
                                        total: 0,
                                    };
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    const isDefaultCurr = currList.targetCurr === currCodeArray[0];

                                    // Manually assign each curr row's timeSerie.
                                    // This is needed when the live rate table use exchangeRateList's data instead of timeSeries.
                                    // Which means the currList that is initialized base on exchangrRateList does not contain timeSeries object
                                    if (!isChartFeatureEnable && isDefaultCurr) {
                                        const histRate = currList.histRate !== null ? currList.histRate : 0
                                        currList.timeSeries = {
                                            lowest: Math.min(currList.latestRate, histRate),
                                            highest: Math.max(currList.latestRate, histRate),
                                            changingRates: [histRate, currList.latestRate],
                                            dayRangeIndicator,
                                            monthRangeIndicator
                                        }
                                    }

                                    const timeSeries = currList.timeSeries;

                                    return (
                                        <>
                                            <TableRow
                                                className={userPreference !== null && userPreference.theme === "color" ? "clipPath" : ""}
                                                key={targetCurrCode}
                                                sx={{
                                                    height: '72.5px',
                                                    ...styleTableRow(targetCurrCode, defaultCurrCode),
                                                    ...sxStyle.TableRow,
                                                    ...(isDefaultCurr
                                                        ? { ...getTargetProps(!isDarkTheme).colorChrome, ...getTargetProps(isDarkTheme).baseColor }
                                                        : getTargetProps(isDarkTheme).borderTop),
                                                }}
                                            >
                                                {/* Currency Code and flag */}
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    onClick={() => handleSetDefaultCurr(targetCurrCode)}
                                                    sx={{
                                                        ...commonStyle.paddingNone,
                                                        ...(isDisplaySM ? sxStyle.TableCell.sm : sxStyle.TableCell.lg),
                                                        ...(isDefaultCurr ? commonStyle.colorInherit : sxStyle.hoverOverride),
                                                    }}
                                                >
                                                    <Box sx={{ ...sxStyle.hoverButton }}>
                                                        <Button
                                                            variant="text"
                                                            disabled={isDefaultCurr && true}
                                                            sx={{
                                                                ...sxStyle.defaultCurrSetterButton.main,
                                                                ...sxStyle.paddingXAxisOnly,
                                                                ...(isDisplaySM ? sxStyle.defaultCurrSetterButton.sm : sxStyle.defaultCurrSetterButton.lg)
                                                            }}
                                                        >
                                                            {getFlag(targetCurrCode, validCurFlagList)}
                                                            <span style={style.span}>
                                                                {isDisplaySM ? targetCurrCode : currCountiesCodeMapDetail[targetCurrCode].display}
                                                            </span>
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                                {/* Currency rate change wrapper */}
                                                <TableCell
                                                    colSpan={isDisplaySM ? 2 : 3}
                                                    sx={{
                                                        ...commonStyle.paddingNone,
                                                        ...commonStyle.borderNone,
                                                        ...commonStyle.colorInherit,
                                                        ...(index !== 0 && !isDisplaySM && isChartFeatureEnable && sxStyle.hoverOverride),
                                                    }}
                                                    onClick={() => handleToggleFlags(index, isDefaultCurr)}
                                                >
                                                    <Table>
                                                        <TableBody>
                                                            <TableRow>
                                                                {/* Currency amount */}
                                                                <TableCell
                                                                    align="right"
                                                                    sx={{
                                                                        ...styleTableCell(currList, isDisplaySM, false),
                                                                        ...getTargetProps(isDisplaySM).width,
                                                                        ...(isDefaultCurr && commonStyle.colorInherit)
                                                                    }}
                                                                >
                                                                    {index !== 0 ? currList.latestRate.toFixed(isDisplaySM ? 2 : 4) : currList.latestRate}
                                                                </TableCell>
                                                                {/* Currency change in percent */}
                                                                {isDisplaySM ? "" :
                                                                    <TableCell
                                                                        align="right"
                                                                        sx={{ ...styleTableCell(currList, isDisplaySM), ...getTargetProps(isDisplaySM).width }}
                                                                    >
                                                                        {currList.change === "NaN" ? "Currenctly Not Avalable" : getDisplayList(currList)}
                                                                    </TableCell>
                                                                }
                                                                {/* Chart Cell */}
                                                                <TableCell
                                                                    align="right"
                                                                    sx={{ ...styleTableCell(currList, isDisplaySM), ...getTargetProps(isDisplaySM).width }}
                                                                >
                                                                    {!isDisplaySM || !isChartFeatureEnable ?
                                                                        <div style={{ ...style.chartDiv.main, ...(isDisplaySM ? style.chartDiv.sm : style.chartDiv.lg) }} >
                                                                            {index !== 0 && <LineGraph timeSeries={timeSeries} displayLabel={false} />}
                                                                        </div> :
                                                                        <Button
                                                                            variant="text"
                                                                            size="small"
                                                                            sx={{
                                                                                ...commonStyle.paddingNone,
                                                                                ...commonStyle.floatRight,
                                                                                ...(isDefaultCurr && commonStyle.colorNone)
                                                                            }}
                                                                        >
                                                                            View Chart
                                                                        </Button>
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableCell>
                                                {/* Delete button */}
                                                <TableCell
                                                    sx={{
                                                        ...styleTableCellDelete(targetCurrCode, defaultCurrCode, isDisplaySM),
                                                        ...(isDisplaySM ? sxStyle.TableCell.sm : sxStyle.TableCell.lg),
                                                        ...commonStyle.textAlign,
                                                        ...(index !== 0 && sxStyle.hoverOverride),
                                                    }}
                                                    onClick={() => handleDelete(targetCurrCode)}
                                                >
                                                    <IconButton
                                                        aria-label="delete"
                                                        sx={{
                                                            ...(targetCurrCode === defaultCurrCode && commonStyle.displayNone),
                                                            ...commonStyle.hoverNone
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TransitionAppendChart
                                                {...attr.RateHistoryGraph}
                                                currencyRateData={currencyRateData}
                                                appendChart={displayRateHistChartFlags[index]}
                                            />
                                        </>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={styleTableRowInFile(false, emptyRows)} >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Table Pageination */}
                    <Box sx={getTargetProps(isDarkTheme).borderTop} >
                        <Box
                            sx={{
                                ...sxStyle.PaginationSubContainer.main,
                                ...(isDisplaySM ? sxStyle.PaginationSubContainer.sm : sxStyle.PaginationSubContainer.lg),
                            }}
                        >
                            {!isDisplaySM &&
                                <CurrCountriesDropDown
                                    sxStyle={isDisplaySM ? sxStyle.CurrCountriesDropDown.sm : sxStyle.CurrCountriesDropDown.lg}
                                    onNewCurrCodeAssigned={handleAddCurrCountry}
                                    {...attr.CurrCountriesDropDown}
                                />
                            }
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={currLists !== null ? currLists.length : 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage={getTargetProps(isDisplaySM).labelRowsPerPage}
                                sx={{ ...(isDisplaySM && sxStyle.Pageination) }}
                            />
                            {!isDisplayMD &&
                                <CircularProgressWithLabel
                                    onUpdateDisplayTime={() => setTriggerNewTimeDisplay(true)}
                                    onUpdateNewLiveRate={updateNewLiveRate}
                                    {...attr.CircularProgressWithLabel}
                                />
                            }
                        </Box>
                        {isDisplayMD &&
                            <Box sx={{ ...sxStyle.progressBarContainer, ...getTargetProps(isDisplaySM).justifyContent }}>
                                {isDisplaySM &&
                                    <CurrCountriesDropDown
                                        sxStyle={isDisplaySM ? sxStyle.CurrCountriesDropDown.sm : sxStyle.CurrCountriesDropDown.lg}
                                        onNewCurrCodeAssigned={handleAddCurrCountry}
                                        {...attr.CurrCountriesDropDown}
                                    />
                                }
                                <CircularProgressWithLabel
                                    onUpdateDisplayTime={() => setTriggerNewTimeDisplay(!triggerNewTimeDisplay)}
                                    onUpdateNewLiveRate={updateNewLiveRate}
                                    {...attr.CircularProgressWithLabel}
                                />
                            </Box>
                        }
                    </Box>
                </Paper>
            </Box >
            }
        </>
    );
};

const baseColor = getBaseColor();

const getTargetProps = (isChecked: boolean) => {
    return {
        displayText: isChecked ? "Live Rates" : "Live Exchange Rates",
        labelRowsPerPage: isChecked ? "Rows:" : "Rows per page:",
        baseColor: { backgroundColor: isChecked ? baseColor.darkPrimary : baseColor.lightPrimary },
        colorChrome: { color: isChecked ? "white" : "black" },
        width: { width: isChecked ? '17.5%' : '33.5%' },
        margin: { margin: isChecked ? "0px" : "16px" },
        justifyContent: { justifyContent: isChecked ? 'space-between' : 'flex-end' },
        borderTop: { borderTop: `1px solid rgba(224, 224, 224, ${isChecked ? 0.20 : 1})`, borderBottom: 'none' },
    }
}

const commonStyle = {
    paddingNone: { padding: '0px' },
    borderNone: { border: 'none' },
    colorInherit: { color: "inherit" },
    colorNone: { color: 'transparent' },
    marginTopNeg15: { marginTop: "-15px" },
    hoverNone: { '&:hover': { background: "transparent" } },
    textAlign: { textAlign: "center" },
    displayNone: { display: "none" },
    floatRight: { float: 'right' }
}

const style = {
    span: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "3px", maxWidth: "200px" },
    CurrCountriesDropDown: { height: "auto" },
    DeleteIcon: { marginRight: "8px" },
    chartDiv: {
        main: { height: "40px", float: "right" as const },
        lg: { width: "70px" },
        sm: { width: "60px", paddingRight: "5px" },
    },
    Tooltip: { margin: "16px" },
    PaperDiv: { display: "flex" },
    NoGapTableContainer: commonStyle.marginTopNeg15,
    marginTop: commonStyle.marginTopNeg15,
};

const sxStyle = {
    Box: { width: 1, overflowY: "auto" },
    Paper: { width: 1, boxShadow: "none", backgroundColor: 'inherit', backgroundImage: "none" },
    Table: {
        lg: { minWidth: 450 },
        sm: { whiteSpace: "nowrap", ...commonStyle.paddingNone },
    },
    TableBody: { width: 1 },
    CurrCountriesDropDown: {
        lg: { minWidth: 150, width: 170, },
        sm: { width: '80px', },
    },
    TableRow: { width: "100%", whiteSpace: "nowrap", transform: 'translate(0)' },
    TableCell: {
        lg: { width: "20%", ...commonStyle.borderNone },
        sm: { width: "10%", ...commonStyle.paddingNone, ...commonStyle.borderNone }
    },
    Typography: {
        flex: '1 1 100%', pl: { sm: 0 }, pr: { xs: 1, sm: 1 }, minHeight: "64px", display: "flex", alignItems: "center",
    },
    Pageination: {
        ...commonStyle.paddingNone, display: 'flex', flex: 'auto', justifyContent: 'center',
        '& div': { ...commonStyle.paddingNone }
    },
    defaultCurrSetterButton: {
        main: {
            display: "flex", alignItems: "center", ...commonStyle.colorInherit, fontWeight: 400, ...commonStyle.hoverNone,
            '&:disabled': commonStyle.colorInherit
        },
        lg: { margin: "0px 15px", ...commonStyle.hoverNone },
        sm: { margin: "0px 10px", ...commonStyle.paddingNone, ...commonStyle.hoverNone },
    },
    hoverButton: {
        height: '-webkit-fill-available', borderRadius: '7px', transition: 'background 0.3s', display: 'flex',
        alignItems: 'center'
    },
    PaginationMainContainer: {
        main: { display: 'flex', justifyContent: 'space-between' },
        lg: { flexDirection: 'row', alignItems: 'center' },
        sm: { flexDirection: 'column', alignItems: 'flex-end' },
    },
    PaginationSubContainer: {
        main: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        lg: { margin: '10px' },
        sm: { marginTop: '10px', width: '-webkit-fill-available' },
    },
    progressBarContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    progressBar: { minWidth: '190px', display: 'flex' },
    paddingXAxisOnly: { padding: '20px 0px' },
    BorderTopOnly: { borderTop: '1px solid rgba(224, 224, 224, 0.40)', borderBottom: 'none' },
    hoverOverride: {
        '&:hover': {
            background: '#9fbee354', margin: '0.5px', transition: 'background 0.6s',
        }
    }
};