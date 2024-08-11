import '../../App.css';
import { useState, useEffect, useMemo } from 'react';
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
import CurrCountriesDropDown from '../subComponents/CurrCountriesDropDown.js';
import EnhancedTableHead from './EnhancedTableHead.js';
import { getComparator, stableSort, styleTableCell, styleTableRow, getDisplayList, styleTableRowInFile, styleTableCellDelete, getDayRangeDate, getMonthRangeDate } from '../../util/ExchangeRateTableDataUtil.js';
import { checkIfExist } from '../../util/checkingMethods.js';
import { createCurrLists } from '../../util/createCurrLists.js';
import { getFlag } from '../../util/getFlag.js';
import { retrieveExchangeRates } from '../../util/apiClient.js';
import { LineGraph } from '../subComponents/LineGraph.js';
import CircularProgressWithLabel from '../subComponents/CircularProgressWithLabel.js';
import TransitionAppendChart from '../subComponents/TransitionAppendChart.js';
import { saveCurrListsToCookie, savePrefCurrCodes } from '../../hook/userController.js';

export default function ExchangeRateTable(props) {
    const { currCountiesCodeMapDetail, validCurFlagList, sortedCurrsCodeList, isDisplaySM, isDisplayMD, userId, userPreference,
        initialCurrLists, initialCurrExchangeRates, isCurrListReady: isReady, isChartFeatureEnable } = props;

    // Setting property base on save preference
    const [currCodeArray, setCurrCodeArray] = useState([...userPreference.liveRateCurrCodes]); // initial currency list that will be displayed on screen
    const [defaultCurrCode, setDefaultCurrCode] = useState(currCodeArray[0]); // set default/main currency that will be used to against the other target currency

    // Initialized currency's visible row proeprty
    const [defaultCurrExchangeRates, setDefaultCurrExchangeRates] = useState(initialCurrExchangeRates !== null ? [...initialCurrExchangeRates] : null); // consist of all the currCode exchange rate, 1 day range. Do not set anything if currently load feature page
    const [currLists, setCurrLists] = useState([...initialCurrLists]);

    // Initialized flags
    const [newCurrCode, setNewCurrCode] = useState(""); // new added currency flag
    const [displayRateHistChartFlags, setDisplayRateHistChartFlags] = useState([...Array(userPreference.liveRateCurrCodes.length)].map(i => false)); // each live rate row's display chart flags
    const [prevDisplayChartIndex, setPrevDisplayChartIndex] = useState(-1); // each live rate row's display chart flags

    // Mui table's setting property
    const [order, setOrder] = useState('desc');
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

    useEffect(() => {
        if (isReady) {
            handleDisplayLatestFetchTimeUpdate();
        }
    }, [isReady]);

    // Update new added currency code to visibl row
    useEffect(() => {
        async function checkNewRow() {
            // console.log("refresh page!!!");

            if (newCurrCode !== "" && !checkIfExist(currLists, newCurrCode)) {
                // console.log("Create new curr list!!!");
                console.log("    >>> createCurrLists!!!")
                const currList = await createCurrLists(defaultCurrCode, newCurrCode, defaultCurrExchangeRates, timeSeriesRangeLength, isChartFeatureEnable);
                const newLists = [...currLists, currList];
                setNewCurrCode("");
                setCurrLists(newLists);
                saveCurrListsToCookie(userId, newLists);
            }
            // console.log("Check Curr Lists after refresh page: ", currLists);
            // console.log("Check Curr Array after refresh page: ", currCodeArray);
        }
        checkNewRow();
    }, [newCurrCode, currLists, defaultCurrExchangeRates, defaultCurrCode, currCodeArray, isChartFeatureEnable]);

    // refresh time display on screen when any time-related property is updated
    useEffect(() => {
        if (triggerNewTimeDisplay) {
            // console.log("Update new display time!!!");
            handleDisplayLatestFetchTimeUpdate();
            setTriggerNewTimeDisplay(false)
        }
    }, [triggerNewTimeDisplay]);

    const handleRequestSort = (event, property) => {
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
    const handleSetDefaultCurr = async (targetCurr) => {
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

            userPreference.liveRateCurrCodes = newCurrCodeArray;
            setDefaultCurrCode(targetCurr);
            setCurrCodeArray(newCurrCodeArray);
            handleCurrCodeArrayCookieUpdate(newCurrCodeArray);
        }
    };

    // Refetch new default currency rate from api
    const handleUpdateDefaultCurrLiveRate = async (currCodeArray) => {
        // console.log("Fetching latest exchange rate from API!!!")
        const newLists = [];
        const initialValue = { baseCurr: currCodeArray[0] };
        const newDefaultCurrExchangeRates = await retrieveExchangeRates(initialValue); // Update exchange rate from API

        for (let i in currCodeArray) {
            console.log("    >>> createCurrLists!!!")
            newLists[i] = await createCurrLists(currCodeArray[0], currCodeArray[i], newDefaultCurrExchangeRates, timeSeriesRangeLength, isChartFeatureEnable);
        }

        setDefaultCurrExchangeRates(newDefaultCurrExchangeRates);
        setCurrLists(newLists);
        saveCurrListsToCookie(userId, newLists);
        handleDisplayLatestFetchTimeUpdate();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const updateNewLiveRate = (event) => {
        // console.log("Timer trigger!!!")
        handleUpdateDefaultCurrLiveRate(currCodeArray);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - currLists.length) : 0;

    const visibleRows = useMemo(
        () =>
            stableSort(currLists, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [currLists, order, orderBy, page, rowsPerPage],
    );

    const handleAddCurrCountry = (e) => {
        console.log("Add new item to list: ", e);
        setNewCurrCode(e.value);
        const newCurrCodeArray = [...currCodeArray, e.value];
        setCurrCodeArray(newCurrCodeArray);
        handleCurrCodeArrayCookieUpdate(newCurrCodeArray);
    };

    const handleDelete = (targetCurr) => {
        if (targetCurr === currCodeArray[0]) {
            // console.log("Attempting to delete default currency row, Exit!!!");
            return;
        }

        // console.log("Delete an item to list: ", targetCurr);
        const newCurrLists = [...currLists];
        const newCurrCodeArray = [...currCodeArray];

        for (let i in newCurrLists) {
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

    const handleCurrCodeArrayCookieUpdate = (newCurrCodeArray) => {
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
            size: "small",
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

    const handleToggleFlags = (index) => {
        if (index === 0)
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
                            {isDisplaySM ? "Live Rates" : "Live Exchange Rates"}
                        </Typography>
                        {!isDisplaySM &&
                            <Tooltip title="Reset Filter" style={{ margin: isDisplaySM ? "0px" : "16px" }} onClick={handleResetFilter}>
                                <IconButton>
                                    <FilterListOffIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    </div>
                    <TableContainer style={isDisplaySM ? { margin: "0" } : style.NoGapTableContainer}>
                        <Table
                            sx={isDisplaySM ? { whiteSpace: "nowrap", padding: "0" } : sxStyle.Table}
                            aria-labelledby="tableTitle"
                            size='medium'
                        >
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={currLists.length}
                                isDisplaySM={isDisplaySM}
                            />
                            <TableBody sx={sxStyle.TableBody}>
                                {visibleRows.map((currList, index) => {
                                    const targetCurrCode = currList.targetCurr;
                                    const currencyRateData = {
                                        baseCurr: currCodeArray[0],
                                        targetCurr: currList.targetCurr
                                    };
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    // Manually assign each curr row's timeSerie.
                                    // This is needed when the live rate table use exchangeRateList's data instead of timeSeries.
                                    // Which means the currList that is initialized base on exchangrRateList does not contain timeSeries object
                                    if (!isChartFeatureEnable && index !== 0) {
                                        currList.timeSeries = {
                                            lowest: Math.min(currList.latestRate, currList.histRate),
                                            highest: Math.max(currList.latestRate, currList.histRate),
                                            changingRates: [parseFloat(currList.histRate), parseFloat(currList.latestRate)],
                                            dayRangeIndicator,
                                            monthRangeIndicator
                                        }
                                    }

                                    const timeSeries = currList.timeSeries;

                                    return (
                                        <>
                                            <TableRow className={userPreference.theme !== "outlined" && "clipPath"} key={targetCurrCode} height={'72.5px'} style={{ ...styleTableRow(targetCurrCode, defaultCurrCode), ...style.TableRow, color: index === 0 ? "white" : "black" }} >
                                                {/* Currency Code and flag */}
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    onClick={() => handleSetDefaultCurr(targetCurrCode)}
                                                    sx={{ ...commonStyle.paddingNone, ...style.TableCell, ...(index !== 0 && sxStyle.hoverButton.hover), color: "inherit" }}
                                                >
                                                    <Box sx={{ ...sxStyle.hoverButton.main }}>
                                                        <Button
                                                            variant="text"
                                                            disabled={index === 0 && true}
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
                                                <TableCell colSpan={isDisplaySM ? 2 : 3} sx={{ ...commonStyle.paddingNone, ...commonStyle.borderNone, ...(index !== 0 && !isDisplaySM && isChartFeatureEnable && sxStyle.hoverButton.hover), color: "inherit" }} onClick={() => handleToggleFlags(index)} >
                                                    <Table>
                                                        <TableBody>
                                                            <TableRow>
                                                                {/* Currency amount */}
                                                                <TableCell align="right" style={{ ...styleTableCell(currList, isDisplaySM, false), width: isDisplaySM ? '17.5%' : '33.5%', color: index === 0 && "inherit" }} >
                                                                    {index !== 0 ? parseFloat(currList.latestRate).toFixed(isDisplaySM ? 2 : 4) : currList.latestRate}
                                                                </TableCell>
                                                                {/* Currency change in percent */}
                                                                {isDisplaySM ? "" :
                                                                    <TableCell align="right" style={{ ...styleTableCell(currList, isDisplaySM), width: isDisplaySM ? '17.5%' : '33.5%' }} >
                                                                        {currList.change === "NaN" ? "Currenctly Not Avalable" : getDisplayList(currList)}
                                                                    </TableCell>
                                                                }
                                                                {/* Chart Cell */}
                                                                <TableCell align="right" style={{ ...styleTableCell(currList, isDisplaySM), width: isDisplaySM ? '17.5%' : '33.5%' }} >
                                                                    {!isDisplaySM || !isChartFeatureEnable ?
                                                                        <div style={{ ...style.chartDiv.main, ...(isDisplaySM ? style.chartDiv.sm : style.chartDiv.lg) }} >
                                                                            {index !== 0 && <LineGraph timeSeries={timeSeries} isFeatureDisplay={isChartFeatureEnable} />}
                                                                        </div> : <Button variant="text" size="small" sx={{ padding: 0, float: 'right', color: index === 0 && 'transparent' }}>View Chart</Button>
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableCell>
                                                {/* Delete button */}
                                                <TableCell
                                                    align="right"
                                                    sx={{ ...styleTableCellDelete(targetCurrCode, defaultCurrCode, isDisplaySM), ...style.TableCell }}
                                                    onClick={() => handleDelete(targetCurrCode)}
                                                >
                                                    <IconButton aria-label="delete" style={{ display: targetCurrCode === defaultCurrCode && "none" }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TransitionAppendChart {...attr.RateHistoryGraph} currencyRateData={currencyRateData} appendChart={displayRateHistChartFlags[index]} />
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
                    <Box sx={{ ...sxStyle.BorderTopOnly }} >
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
                                count={currLists.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage={isDisplaySM ? "Rows:" : "Rows per page:"}
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
                            <Box sx={{ ...sxStyle.progressBarContainer, justifyContent: isDisplaySM ? 'space-between' : 'flex-end' }}>
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

const commonStyle = {
    paddingNone: { padding: '0px' },
    borderNone: { border: 'none' },
}

const style = {
    span: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "3px", maxWidth: "200px" },
    CurrCountriesDropDown: { height: "auto" },
    DeleteIcon: { marginRight: "8px" },
    chartDiv: {
        main: { height: "40px", float: "right" },
        lg: { width: "70px" },
        sm: { width: "60px", paddingRight: "5px" },
    },
    Tooltip: { margin: "16px" },
    PaperDiv: { display: "flex" },
    NoGapTableContainer: { marginTop: "-15px" },
    TableRow: { width: "100%", whiteSpace: "nowrap", transform: 'translate(0)' },
    TableCell: {
        lg: { width: "20%", ...commonStyle.borderNone },
        sm: { width: "10%", padding: "0px 0px 10px 10px", ...commonStyle.borderNone }
    },
};

const sxStyle = {
    Box: { width: 1, overflowY: "auto" },
    Paper: { width: 1, boxShadow: "none", backgroundColor: 'inherit', backgroundImage: "none" },
    Table: { minWidth: 450 },
    TableBody: { width: 1 },
    CurrCountriesDropDown: {
        lg: { minWidth: 150, width: 170, },
        sm: { width: '80px', },
    },
    TableRow: { '&:last-child td, &:last-child th': { border: 0 } },
    Typography: { flex: '1 1 100%', pl: { sm: 0 }, pr: { xs: 1, sm: 1 }, minHeight: "64px", display: "flex", alignItems: "center", },
    Pageination: { padding: '0px', display: 'flex', flex: 'auto', justifyContent: 'center', '& div': { padding: 0 } },
    defaultCurrSetterButton: {
        main: { display: "flex", alignItems: "center", color: "inherit", fontWeight: 400, '&:hover': { background: 'none' }, '&:disabled': { color: 'inherit' } },
        lg: { margin: "0px 15px" },
        sm: { margin: "0px 10px", padding: "0px" },
    },
    hoverButton: {
        main: { height: '-webkit-fill-available', borderRadius: '7px', transition: 'background 0.3s', display: 'flex', alignItems: 'center' },
        hover: { '&:hover': { background: '#9fbee354', margin: '0.5px', borderRadius: '10px', transition: 'background 0.6s' } },
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
    BorderTopOnly: { borderTop: '1px solid rgba(224, 224, 224, 1)', borderBottom: 'none' },
};