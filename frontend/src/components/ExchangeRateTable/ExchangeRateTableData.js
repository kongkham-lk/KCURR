import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import CurrCountriesDropDown from '../CurrCountriesDropDown';
import EnhancedTableHead from './EnhancedTableHead';
import { getComparator, stableSort, styleTableCell, styleTableRow, getDisplayList, styleTableRowInFile, styleTableCellDelete } from '../../util/ExchangeRateTableDataUtil';
import { checkIfExist } from '../../util/checkingMethods';
import { createCurrLists } from '../../util/createCurrLists';
import { getFlag } from '../../util/getFlag';
import { retrieveExchangeRates } from '../../util/apiClient';
import { LineGraph } from '../LineGraph';
import useInitialCurrListsGetter from '../../hook/useInitialCurrListsGetter';
import CircularProgressWithLabel from '../../util/CircularProgressWithLabel';

export default function ExchangeRateTableData(props) {
    const { currApiDataSet, currCountiesCodeMapDetail, initialDefaultCurr, isDisplaySM } = props;
    const [currDataSet, setCurrDataSet] = useState([...currApiDataSet]);
    const [defaultCurrCode, setDefaultCurrCode] = useState(initialDefaultCurr.baseCurr);
    const [currCodeArray, setCurrCodeArray] = useState(['USD', 'CAD', 'EUR', 'GBP']);

    const timeSeriesRangeLength = "1w";

    // retrieved initial exchange rate table list
    const { initialCurrLists, isReady } = useInitialCurrListsGetter(defaultCurrCode, currCodeArray, currDataSet, timeSeriesRangeLength);

    const [currLists, setCurrLists] = useState(initialCurrLists);
    const [newCurrCode, setNewCurrCode] = useState("");
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('');
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        if (isReady) {
            setCurrLists([...initialCurrLists]);
        }
    }, [isReady, initialCurrLists]);

    useEffect(() => {
        async function checkNewRow() {
            console.log("refresh page!!!");
            
            if (newCurrCode !== "" && !checkIfExist(currLists, newCurrCode)) {
                console.log("Create new curr list!!!");
                const currList = await createCurrLists(defaultCurrCode, newCurrCode, currDataSet, timeSeriesRangeLength);
                const newLists = [...currLists, currList];
                setNewCurrCode("");
                setCurrLists(newLists);
            }
            console.log("Check Curr Lists after refresh page: ", currLists);
            console.log("Check Curr Array after refresh page: ", currCodeArray);
        }
        checkNewRow();
    }, [newCurrCode, currLists, currDataSet, defaultCurrCode]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Re-arrange curr list order
    const handleSetDefaultCurr = async (targetCurr) => {
        console.log("Rearrage list!!!");
        
        const oldTargetCurrArray = [...currCodeArray];
        const targetCurrIndex = currLists.findIndex(curr => curr.targetCurr === targetCurr);
        
        if (targetCurrIndex > -1 && targetCurrIndex !== 0) {
            const [targetCurr] = oldTargetCurrArray.splice(targetCurrIndex, 1);
            oldTargetCurrArray.unshift(targetCurr);
        }

        console.log("Check Array after re-arrange:  ", oldTargetCurrArray);
        await handleUpdateNewLiveRate(oldTargetCurrArray); // Refetch new update rate from beacon api

        setDefaultCurrCode(targetCurr);
        setCurrCodeArray([...oldTargetCurrArray]);
    };

    // Refetch new update rate from api
    const handleUpdateNewLiveRate = async (currCodeArray) => {
        console.log("Fetching latest rate from API!!!")
        const newLists = [];
        const initialValue = { baseCurr: currCodeArray[0] };
        const newAddCurrDataSet = await retrieveExchangeRates(initialValue);

        for (let i in currCodeArray) {
            newLists[i] = await createCurrLists(currCodeArray[0], currCodeArray[i], newAddCurrDataSet, timeSeriesRangeLength);
        }

        console.log("check response list of latest rate:  ", newLists);
        setCurrLists(newLists);
        setCurrDataSet(newAddCurrDataSet);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const updateNewLiveRate = (event) => {
        console.log("Timer trigger!!!")
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
        console.log("Add new item to list: ", e.value);
        setNewCurrCode(e.value);
        setCurrCodeArray([...currCodeArray, e.value])
    };

    const handleDelete = (targetCurr) => {
        if (targetCurr === currCodeArray[0]) {
            console.log("Attempting to delete default currency row, Exit!!!");
            return;
        }
            
        console.log("Delete an item to list: ", targetCurr);
        const oldCurrLists = [...currLists];
        const oldTargetCurrCodeArray = [...currCodeArray];

        for (let i in oldCurrLists) {
            if (oldCurrLists[i].targetCurr === targetCurr && targetCurr !== targetCurr) {
                oldCurrLists.splice(i, 1);
                oldTargetCurrCodeArray.splice(i, 1);
            }
        }
        console.log("check Curr List after delete:  ", oldCurrLists);
        setCurrLists(oldCurrLists);
        setCurrCodeArray(oldTargetCurrCodeArray);
    }

    const handleResetFilter = () => setOrderBy('');

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
                            {isDisplaySM ? "Rate Listing" : "Exchange Rate Listing"}
                        </Typography>
                        <Tooltip title="Reset Filter" style={{margin: isDisplaySM ? "0px" : "16px"}} onClick={handleResetFilter}>
                            <IconButton>
                                <FilterListOffIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <TableContainer style={isDisplaySM ? {margin: "0"} : style.NoGapTableContainer}>
                        <Table
                            sx={isDisplaySM ? {whiteSpace: "nowrap", padding: "0"} : sxStyle.Table}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
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
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    const timeSeries = currList.timeSeries;

                                    return (
                                        <TableRow key={targetCurrCode} style={styleTableRow(targetCurrCode, defaultCurrCode)} >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                <Box sx={sxStyle.hoverButton}>
                                                    <Button variant="text" onClick={() => handleSetDefaultCurr(targetCurrCode)} 
                                                            sx={{
                                                                    ...sxStyle.defaultCurrSetterButton.main, 
                                                                    ...(isDisplaySM ? sxStyle.defaultCurrSetterButton.sm : sxStyle.defaultCurrSetterButton.lg)
                                                                }} >
                                                        {getFlag(targetCurrCode)}
                                                        <span style={style.span}>{isDisplaySM ? targetCurrCode : currCountiesCodeMapDetail[targetCurrCode].display}</span>
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right" style={{paddingRight: isDisplaySM && "0px"}}>
                                                {isDisplaySM ? parseFloat(currList.latestRate).toFixed(2) : currList.latestRate}
                                            </TableCell>
                                            { isDisplaySM ? "" : 
                                                <TableCell align="right" style={styleTableCell(currList, isDisplaySM)}>
                                                    {currList.change === "NaN" ? "Currenctly Not Avalable" : getDisplayList(currList)}
                                                </TableCell>
                                            }
                                            <TableCell align="right" style={styleTableCell(currList, isDisplaySM)}>
                                                <div style={{...style.chartDiv.main, ...(isDisplaySM ? style.chartDiv.sm : style.chartDiv.lg)}}>
                                                    {timeSeries !== null && <LineGraph timeSeries={timeSeries} />}
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                style={styleTableCellDelete(targetCurrCode, defaultCurrCode, isDisplaySM)}
                                                onClick={() => handleDelete(targetCurrCode)}
                                            >
                                                <IconButton aria-label="delete" style={{ display: targetCurrCode === defaultCurrCode && "none" }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
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
                    <Box sx={{...sxStyle.PaginationSubContainer.main, ...(isDisplaySM ? sxStyle.PaginationSubContainer.sm : sxStyle.PaginationSubContainer.lg)}}>
                        <CurrCountriesDropDown
                            sxStyle={isDisplaySM ? sxStyle.CurrCountriesDropDown.sm : sxStyle.CurrCountriesDropDown.lg}
                            label="Add Currency"
                            inputCurrType="targetCurr"
                            onAddCurrCountry={handleAddCurrCountry}
                            currCountiesCodeMapDetail={currCountiesCodeMapDetail}
                            passInStyle={style.CurrCountriesDropDown}
                            size="small"
                        />
                        <TablePagination
                            rowsPerPageOptions={isDisplaySM ? [] : [5, 10, 25]}
                            component="div"
                            count={currLists.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        {!isDisplaySM && <CircularProgressWithLabel sx={sxStyle.progressBar} onUpdateNewLiveRate={updateNewLiveRate} />}
                    </Box>
                    {isDisplaySM && <Box sx={sxStyle.progressBarContainer}>
                        <CircularProgressWithLabel sx={sxStyle.progressBar} onUpdateNewLiveRate={updateNewLiveRate} />
                    </Box>}
                </Paper>
                {isDisplaySM ? "" : <FormControlLabel
                    control={<Switch checked={dense} onChange={updateNewLiveRate}/>}
                    label="Dense padding"
                    sx={{display: 'none'}}
                />}
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
    Box: { width: 1, overflowY: "auto"},
    Paper: { width: 1, boxShadow: "none" },
    Table: { minWidth: 450 },
    TableBody: { width: 1 },
    CurrCountriesDropDown: { 
        lg: { minWidth: 150, width: 170,},
        sm: { width: '80px',},
    },
    TableRow: { '&:last-child td, &:last-child th': { border: 0 } },
    Typography: { flex: '1 1 100%', pl: { sm: 0 }, pr: { xs: 1, sm: 1 }, minHeight: "64px", display: "flex", alignItems: "center", },
    Pageination: { display: "flex", justifyContent: "space-between", flexWrap: 'wrap' },
    defaultCurrSetterButton: {
        main:{ display: "flex", alignItems: "center", color: "black", fontWeight: 400, '&:hover': { background: 'none' } },
        lg: { marginLeft: "15px" },
        sm: { marginLeft: "10px", padding: "0px" },
    },
    hoverButton: { height: '-webkit-fill-available', borderRadius: '7px', transition: 'background 0.3s',
                    '&:hover': { background: '#0000000a', padding: '10px 0px', margin: '0px 0.5px', }, },
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
    progressBarContainer: { marginRight: '15px' },
};