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
import { getComparator, stableSort, styleTableCell, styleTableRow, getDisplayList, styleTableRowInFile, styleTableCellDelete } from '../../util/ExchangeRateTableDataUtil';
import { checkIfExist } from '../../util/checkingMethods';
import { createCurrLists } from '../../util/createCurrLists';
import { getFlag } from '../../util/getFlag';
import { retrieveExchangeRates } from '../../util/apiClient';
import { LineGraph } from '../subComponents/LineGraph';
import useInitialCurrListsGetter from '../../hook/useInitialCurrListsGetter';
import CircularProgressWithLabel from '../subComponents/CircularProgressWithLabel';
import TransitionAppendChart from '../subComponents/TransitionAppendChart.js';

export default function ExchangeRateTableData(props) {
    const { currApiDataSet, currCountiesCodeMapDetail, validCurFlagList, initialDefaultCurr, sortedCurrsCodeList, isDisplaySM, isDisplayMD, currentUrl } = props;
    const [currDataSet, setCurrDataSet] = useState([...currApiDataSet]);
    const [defaultCurrCode, setDefaultCurrCode] = useState(initialDefaultCurr.baseCurr);
    const [currCodeArray, setCurrCodeArray] = useState(['USD', 'CAD', 'EUR', 'GBP']);
    const [lastUpdateRateTime, setLastUpdateRateTime] = useState("");
    const [appendCharts, setAppendCharts] = useState([false, false, false, false]);

    const timeSeriesRangeLength = "1w";
    const displayFeature = currentUrl.pathname.toLowerCase().includes("chart");

    // retrieved initial exchange rate table list
    const { initialCurrLists, isReady } = useInitialCurrListsGetter(defaultCurrCode, currCodeArray, currDataSet, timeSeriesRangeLength);
    const [currLists, setCurrLists] = useState(initialCurrLists);
    const [newCurrCode, setNewCurrCode] = useState("");
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [triggerNewTimeDisplay, setTriggerNewTimeDisplay] = useState(false);

    useEffect(() => {
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
                const currList = await createCurrLists(defaultCurrCode, newCurrCode, currDataSet, timeSeriesRangeLength);
                const newLists = [...currLists, currList];
                setNewCurrCode("");
                setCurrLists(newLists);
            }
            // console.log("Check Curr Lists after refresh page: ", currLists);
            // console.log("Check Curr Array after refresh page: ", currCodeArray);
        }
        checkNewRow();
    }, [newCurrCode, currLists, currDataSet, defaultCurrCode, currCodeArray]);

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
            await handleUpdateNewLiveRate(newCurrCodeArray); // Refetch new update rate from beacon api

            setCurrCodeArray(newCurrCodeArray);
            setDefaultCurrCode(targetCurr);
        }
    };

    // Refetch new update rate from api
    const handleUpdateNewLiveRate = async (currCodeArray) => {
        // console.log("Fetching latest rate from API!!!")
        const newLists = [];
        const initialValue = { baseCurr: currCodeArray[0] };
        const newAddCurrDataSet = await retrieveExchangeRates(initialValue);

        for (let i in currCodeArray) {
            newLists[i] = await createCurrLists(currCodeArray[0], currCodeArray[i], newAddCurrDataSet, timeSeriesRangeLength);
        }

        // console.log("check response list of latest rate:  ", newLists);
        setCurrLists(newLists);
        setCurrDataSet(newAddCurrDataSet);
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
        handleUpdateNewLiveRate(currCodeArray);
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
            onAddCurrCountry: {handleAddCurrCountry},
            currCountiesCodeMapDetail,
            passInStyle: {...style.CurrCountriesDropDown},
            size: "small",
            sortedCurrsCodeList,
            validCurFlagList,
        },
        CircularProgressWithLabel: {
            ...sxStyle.progressBar,
            onUpdateNewLiveRate: {updateNewLiveRate},
            lastUpdateRateTime,
            isDisplaySM,
            isDisplayMD,
        },
        RateHistoryGraph: { 
            passInRequestState: true,
            displayFeature,
            ...props
        },
    };

    const handleToggleFlags = async (index) => {
        const newAppendCharts = [...appendCharts];
        const isShow = appendCharts[index]
        newAppendCharts[index] = !isShow;
        setAppendCharts([...newAppendCharts]);
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
                        <Tooltip title="Reset Filter" style={{ margin: isDisplaySM ? "0px" : "16px" }} onClick={handleResetFilter}>
                            <IconButton>
                                <FilterListOffIcon />
                            </IconButton>
                        </Tooltip>
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
                                    const timeSeries = currList.timeSeries;

                                    return (
                                        <>
                                            <TableRow class="clipPath" key={targetCurrCode + "_Main"} style={{...styleTableRow(targetCurrCode, defaultCurrCode)}} >
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    sx={{...sxStyle.paddingNone, ...sxStyle.BorderNone }}
                                                >
                                                    <Box sx={{...sxStyle.hoverButton.main, ...(index !== 0 && sxStyle.hoverButton.hover)}}>
                                                        <Button
                                                            variant="text"
                                                            onClick={() => handleSetDefaultCurr(targetCurrCode)}
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
                                                <TableCell align="right" style={{ paddingRight: isDisplaySM && "0px", ...sxStyle.BorderNone }}>
                                                    {isDisplaySM ? parseFloat(currList.latestRate).toFixed(2) : currList.latestRate}
                                                </TableCell>
                                                {isDisplaySM ? "" :
                                                    <TableCell align="right" style={{...styleTableCell(currList, isDisplaySM)}}>
                                                        {currList.change === "NaN" ? "Currenctly Not Avalable" : getDisplayList(currList)}
                                                    </TableCell>
                                                }
                                                {/* Chart Cell */}
                                                <TableCell align="right" style={{...styleTableCell(currList, isDisplaySM)}}>
                                                    <div style={{ ...style.chartDiv.main, ...(isDisplaySM ? style.chartDiv.sm : style.chartDiv.lg) }} onClick={() => handleToggleFlags(index)} >
                                                        {timeSeries !== null && <LineGraph timeSeries={timeSeries} />}
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    style={{...styleTableCellDelete(targetCurrCode, defaultCurrCode, isDisplaySM)}}
                                                    onClick={() => handleDelete(targetCurrCode)}
                                                >
                                                    <IconButton aria-label="delete" style={{ display: targetCurrCode === defaultCurrCode && "none" }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            {console.log("Hide Chart!!!")}
                                            <TransitionAppendChart {...attr.RateHistoryGraph} currencyRateData={currencyRateData} appendChart={appendCharts[index]} />
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
                    <Box>
                        <Box
                            sx={{
                                ...sxStyle.PaginationSubContainer.main,
                                ...(isDisplaySM ? sxStyle.PaginationSubContainer.sm : sxStyle.PaginationSubContainer.lg),
                            }}
                        >
                            {!isDisplaySM &&
                                <CurrCountriesDropDown
                                    sxStyle={isDisplaySM ? sxStyle.CurrCountriesDropDown.sm : sxStyle.CurrCountriesDropDown.lg}
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
                                    {...attr.CircularProgressWithLabel}
                                />
                            }
                        </Box>
                        {isDisplayMD &&
                            <Box sx={{ ...sxStyle.progressBarContainer, justifyContent: isDisplaySM ? 'space-between' : 'flex-end' }}>
                                {isDisplaySM &&
                                    <CurrCountriesDropDown
                                        sxStyle={isDisplaySM ? sxStyle.CurrCountriesDropDown.sm : sxStyle.CurrCountriesDropDown.lg}
                                        {...attr.CurrCountriesDropDown}
                                    />
                                }
                                <CircularProgressWithLabel
                                    onUpdateDisplayTime={() => setTriggerNewTimeDisplay(!triggerNewTimeDisplay)}
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
    NoGapTableContainer: { marginTop: "-15px" }
};

const sxStyle = {
    Box: { width: 1, overflowY: "auto" },
    Paper: { width: 1, boxShadow: "none" },
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
        main: {height: '-webkit-fill-available', borderRadius: '7px', transition: 'background 0.3s',},
        hover: {'&:hover': { background: '#9fbee354', margin: '0.5px', borderRadius: '10px' }},
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
    paddingNone: {padding: '0px'},
    paddingXAxisOnly: {padding: '20px 0px'},
    BorderTopOnly: {borderTop: '1px solid rgba(224, 224, 224, 1)', borderBottom: 'none'},
    BorderNone: {border: 'none'}
};