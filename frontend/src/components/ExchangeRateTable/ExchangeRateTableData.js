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
import CurrCountriesDropDown from '../subComponents/CurrCountriesDropDown';
import EnhancedTableHead from './EnhancedTableHead';
import { getComparator, stableSort, styleTableCell, styleTableRow, getDisplayList, styleTableRowInFile, styleTableCellDelete, getDayRangeDate, getMonthRangeDate } from '../../util/ExchangeRateTableDataUtil';
import { checkIfExist } from '../../util/checkingMethods';
import { createCurrLists } from '../../util/createCurrLists';
import { getFlag } from '../../util/getFlag';
import { retrieveExchangeRates } from '../../util/apiClient';
import { LineGraph } from '../subComponents/LineGraph';
import useInitialCurrListsGetter from '../../hook/useInitialCurrListsGetter';
import CircularProgressWithLabel from '../subComponents/CircularProgressWithLabel';
import TransitionAppendChart from '../subComponents/TransitionAppendChart.js';

export default function ExchangeRateTableData(props) {
    const { initialDefaultCurrExchangeRates, currCountiesCodeMapDetail, validCurFlagList, initialDefaultCurr, sortedCurrsCodeList, isDisplaySM, isDisplayMD, isFeatureDisplay, userId, userPreference } = props;
    const timeSeriesRangeLength = "1d"; // time range for displaying chart on the live rate table
console.log(userPreference.currencyCountries)
    const [defaultCurrCode, setDefaultCurrCode] = useState(initialDefaultCurr.baseCurr); // set default/main currency that will be used to against the other target currency
    const [currCodeArray, setCurrCodeArray] = useState([...userPreference.currencyCountries]); // initial currency list that will be displayed on screen
    const [defaultCurrExchangeRates, setDefaultCurrExchangeRates] = useState(isFeatureDisplay ? null : [...initialDefaultCurrExchangeRates]);
    const [lastUpdateRateTime, setLastUpdateRateTime] = useState(""); // specified the latest update rate of the live rate table
    const [displayRateHistChartFlags, setDisplayRateHistChartFlags] = useState([false, false, false, false]); // each live rate row's display chart flags
    const [prevDisplayChartIndex, setPrevDisplayChartIndex] = useState(-1); // each live rate row's display chart flags
    const [newCurrCode, setNewCurrCode] = useState("");
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [triggerNewTimeDisplay, setTriggerNewTimeDisplay] = useState(false);

    const { initialCurrLists, isReady } = useInitialCurrListsGetter(defaultCurrCode, currCodeArray, defaultCurrExchangeRates, timeSeriesRangeLength, isFeatureDisplay); // retrieved initial exchange rate table list
    const [currLists, setCurrLists] = useState(initialCurrLists);
    const [dayRangeIndicator, setDayRangeIndicator] = useState([getDayRangeDate(1), getDayRangeDate(0)]); // needed when the live rate table use exchange rate data instead of timeSeries
    const [monthRangeIndicator, setMonthRangeIndicator] = useState([getMonthRangeDate(1), getMonthRangeDate(0)]); // needed when the live rate table use exchange rate data instead of timeSeries

    useEffect(() => {
        //console.log("setCurrLists from initialList, isReady status: ", isReady)
        if (isReady) {
            setCurrLists([...initialCurrLists]);
            handleUpdateRateTime();
        }
    }, [isReady, initialCurrLists]);

    useEffect(() => {
        async function checkNewRow() {
            // console.log("refresh page!!!");

            if (newCurrCode !== "" && !checkIfExist(currLists, newCurrCode)) {
                // console.log("Create new curr list!!!");
                const currList = await createCurrLists(defaultCurrCode, newCurrCode, defaultCurrExchangeRates, timeSeriesRangeLength, isFeatureDisplay);
                const newLists = [...currLists, currList];
                setNewCurrCode("");
                setCurrLists(newLists);
            }
            // console.log("Check Curr Lists after refresh page: ", currLists);
            // console.log("Check Curr Array after refresh page: ", currCodeArray);
        }
        checkNewRow();
    }, [newCurrCode, currLists, defaultCurrExchangeRates, defaultCurrCode, currCodeArray]);

    // refresh time display on screen when any time-related property is updated
    useEffect(() => {
        // console.log("Update new display time!!!");
        handleUpdateRateTime();
    }, [triggerNewTimeDisplay]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleUpdateRateTime = () => {
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

            userPreference.currencyCountries = newCurrCodeArray;
            setCurrCodeArray(newCurrCodeArray);
            setDefaultCurrCode(targetCurr);
        }
    };

    // Refetch new default currency rate from api
    const handleUpdateDefaultCurrLiveRate = async (currCodeArray) => {
        // console.log("Fetching latest exchange rate from API!!!")
        const newLists = [];
        const initialValue = { baseCurr: currCodeArray[0] };
        const newDefaultCurrExchangeRates = await retrieveExchangeRates(initialValue); // Update exchange rate from API

        for (let i in currCodeArray) {
            newLists[i] = await createCurrLists(currCodeArray[0], currCodeArray[i], newDefaultCurrExchangeRates, timeSeriesRangeLength, isFeatureDisplay);
        }

        setDefaultCurrExchangeRates(newDefaultCurrExchangeRates);
        setCurrLists(newLists);
        handleUpdateRateTime();
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
        // console.log("Add new item to list: ", e.value);
        setNewCurrCode(e.value);
        setCurrCodeArray([...currCodeArray, e.value])
    };

    const handleDelete = (targetCurr) => {
        if (targetCurr === currCodeArray[0]) {
            // console.log("Attempting to delete default currency row, Exit!!!");
            return;
        }

        // console.log("Delete an item to list: ", targetCurr);
        const oldCurrLists = [...currLists];
        const oldTargetCurrCodeArray = [...currCodeArray];

        for (let i in oldCurrLists) {
            // only delete the currency in the list that match targetCurr, but not defaultCurr 
            if (oldCurrLists[i].targetCurr === targetCurr && targetCurr !== defaultCurrCode) {
                oldCurrLists.splice(i, 1);
                oldTargetCurrCodeArray.splice(i, 1);
            }
        }
        // console.log("check Curr List after delete:  ", oldCurrLists);
        setCurrLists(oldCurrLists);
        setCurrCodeArray(oldTargetCurrCodeArray);
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
            isFeatureDisplay,
            ...props
        },
    };

    const handleToggleFlags = async (index) => {
        if (index === 0)
            return;
        
        if (isFeatureDisplay) {
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
                                    // console.log("currList.latestRate: ", currList.latestRate)
                                    // console.log("currList.histRate: ", currList.histRate)

                                    // manually assign each curr row's timeSerie
                                    // this is needed when the live rate table use exchange rate data instead of timeSeries
                                    if (!isFeatureDisplay && index !== 0) {
                                        currList.timeSeries = {
                                            lowest: Math.min(currList.latestRate, currList.histRate),
                                            highest: Math.max(currList.latestRate, currList.histRate),
                                            changingRates: [parseFloat(currList.histRate), parseFloat(currList.latestRate)],
                                            dayRangeIndicator,
                                            monthRangeIndicator
                                        }
                                    }

                                    const timeSeries = currList.timeSeries;
                                    // console.log("check TimeSeries: ", currList)

                                    return (
                                        <>
                                            <TableRow className="clipPath" key={targetCurrCode} height={'72.5px'} style={{ ...styleTableRow(targetCurrCode, defaultCurrCode), ...style.TableRow }} >
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    onClick={() => handleSetDefaultCurr(targetCurrCode)}
                                                    sx={{ ...commonStyle.paddingNone, ...commonStyle.borderNone, ...style.TableCell, ...(index !== 0 && sxStyle.hoverButton.hover) }}
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
                                                <TableCell colSpan={isDisplaySM ? 2 : 3} sx={{ ...commonStyle.paddingNone, ...commonStyle.borderNone, ...(index !== 0 && !isDisplaySM && isFeatureDisplay && sxStyle.hoverButton.hover) }} onClick={() => handleToggleFlags(index)} >
                                                    <Table>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell align="right" style={{ ...styleTableCell(currList, isDisplaySM, false), width: isDisplaySM ? '17.5%' : '33.5%' }} >
                                                                    {index !== 0 ? parseFloat(currList.latestRate).toFixed(isDisplaySM ? 2 : 4) : currList.latestRate}
                                                                </TableCell>
                                                                {isDisplaySM ? "" :
                                                                    <TableCell align="right" style={{ ...styleTableCell(currList, isDisplaySM), width: isDisplaySM ? '17.5%' : '33.5%' }} >
                                                                        {currList.change === "NaN" ? "Currenctly Not Avalable" : getDisplayList(currList)}
                                                                    </TableCell>
                                                                }
                                                                {/* Chart Cell */}
                                                                <TableCell align="right" style={{ ...styleTableCell(currList, isDisplaySM), width: isDisplaySM ? '17.5%' : '33.5%' }} >
                                                                    {!isDisplaySM || !isFeatureDisplay? 
                                                                        <div style={{ ...style.chartDiv.main, ...(isDisplaySM ? style.chartDiv.sm : style.chartDiv.lg) }} >
                                                                            {index !== 0 && <LineGraph timeSeries={timeSeries} isFeatureDisplay={isFeatureDisplay} />}
                                                                        </div> : <Button variant="text" size="small" sx={{padding: 0, float: 'right', color: index === 0 && 'transparent'}}>View Chart</Button>
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableCell>
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
                                    onAddCurrCountry={handleAddCurrCountry}
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
                                    onUpdateDisplayTime={() => setTriggerNewTimeDisplay(!triggerNewTimeDisplay)}
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
                                        onAddCurrCountry={handleAddCurrCountry}
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
    Paper: { width: 1, boxShadow: "none", backgroundColor: 'inherit' },
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
        main: { display: "flex", alignItems: "center", color: "black", fontWeight: 400, '&:hover': { background: 'none' }, '&:disabled': { color: 'black' } },
        lg: { margin: "0px 15px" },
        sm: { margin: "0px 10px", padding: "0px" },
    },
    hoverButton: {
        main: { height: '-webkit-fill-available', borderRadius: '7px', transition: 'background 0.3s', display: 'flex', alignItems: 'center'},
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