import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Pagination from '@mui/material/Pagination';
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
import useMediaQuery from '@mui/material/useMediaQuery';


export default function ExchangeRateTableData(props) {
    const isMobileScreen = useMediaQuery('(max-width:414px)');
    const { currApiDataSet, currCountiesCodeMapDetail, currInput } = props;
    const [currDataSet, setCurrDataSet] = useState([...currApiDataSet]);
    const [defaultCurr, setDefaultCurr] = useState(currInput.baseCurr);
    const initialTargetCurrArray = ['USD', 'CAD', 'EUR', 'GBP'];
    if (currInput.baseCurr !== "USD") {
        initialTargetCurrArray.unshift(currInput.baseCurr);
        initialTargetCurrArray.splice(-1, 1);
    }

    const timeSeriesRange = "Week";

    const { initialCurrLists, isReady } = useInitialCurrListsGetter(defaultCurr, initialTargetCurrArray, currDataSet, timeSeriesRange);

    const [currLists, setCurrLists] = useState(initialCurrLists);
    const [newCurr, setNewCurr] = useState("");
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
            if (newCurr !== "" && !checkIfExist(currLists, newCurr)) {
                const currList = await createCurrLists(defaultCurr, newCurr, currDataSet, timeSeriesRange);
                const newLists = [...currLists, currList];
                setNewCurr("");
                setCurrLists(newLists)
            }
        }
        checkNewRow();
    }, [newCurr, currLists, currDataSet, defaultCurr]
    )

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSetDefaultCurr = async (targetCurr) => {
        const oldLists = [];
        const newLists = [];
        const initialValue = { baseCurr: targetCurr };
        const newAddCurrDataSet = await retrieveExchangeRates(initialValue);

        for (let i in currLists) {
            if (currLists[i].targetCurr !== targetCurr) {
                oldLists.push(currLists[i].targetCurr);
            }
        }
        oldLists.unshift(targetCurr)

        for (let i in oldLists) {
            newLists[i] = await createCurrLists(targetCurr, oldLists[i], newAddCurrDataSet, timeSeriesRange);
        }

        setCurrLists(newLists);
        setDefaultCurr(targetCurr);
        setCurrDataSet(newAddCurrDataSet);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
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

    const handleAddCurrCountry = (e) => setNewCurr(e.value);

    const handleDelete = (targetCurr) => {
        const oldCurrLists = [...currLists];
        for (let i in oldCurrLists) {
            if (oldCurrLists[i].targetCurr === targetCurr && targetCurr !== defaultCurr) {
                oldCurrLists.splice(i, 1)
            }
        }
        setCurrLists(oldCurrLists);
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
                            {isMobileScreen ? "Rate Listing" : "Exchange Rate Listing"}
                        </Typography>
                        <Tooltip title="Reset Filter" style={{margin: isMobileScreen ? "0px" : "16px"}} onClick={handleResetFilter}>
                            <IconButton>
                                <FilterListOffIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <TableContainer style={isMobileScreen ? {margin: "0"} : style.NoGapTableContainer}>
                        <Table
                            sx={isMobileScreen ? {whiteSpace: "nowrap", padding: "0"} : sxStyle.Table}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={currLists.length}
                            />
                            <TableBody sx={sxStyle.TableBody}>
                                {visibleRows.map((currList, index) => {
                                    const targetCurr = currList.targetCurr;
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    const timeSeries = currList.timeSeries;

                                    return (
                                        <TableRow key={targetCurr} style={styleTableRow(targetCurr, defaultCurr)} >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                <Button variant="text" style={isMobileScreen ? style.divSmallScreen : style.divFullScreen} onClick={() => handleSetDefaultCurr(targetCurr)} >
                                                    {getFlag(targetCurr)}
                                                    <span style={style.span}>{isMobileScreen ? targetCurr : currCountiesCodeMapDetail[targetCurr].display}</span>
                                                </Button>
                                            </TableCell>
                                            <TableCell align="right" style={{paddingRight: isMobileScreen && "0px"}}>{isMobileScreen ? parseFloat(currList.latestRate).toFixed(2) : currList.latestRate}</TableCell>
                                            { isMobileScreen ? "" : <TableCell align="right" style={styleTableCell(currList, isMobileScreen)}>
                                                {currList.change === "NaN" ? "Currenctly Not Avalable" : getDisplayList(currList)}
                                            </TableCell>}
                                            <TableCell align="right" style={styleTableCell(currList, isMobileScreen)}>
                                                <div style={isMobileScreen ? style.chartDivSmallScreen : style.chartDivFullScreen}>
                                                    {timeSeries !== null && <LineGraph timeSeries={timeSeries} />}
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                style={styleTableCellDelete(targetCurr, defaultCurr, isMobileScreen)}
                                                onClick={() => handleDelete(targetCurr)}
                                            >
                                                <DeleteIcon style={style.DeleteIcon} />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={styleTableRowInFile(dense, emptyRows)} >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={isMobileScreen ? [] : [5, 10, 25]}
                        component="div"
                        count={currLists.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                {isMobileScreen ? "" : <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense padding"
                />}
                <CurrCountriesDropDown
                    sxStyle={sxStyle.CurrCountriesDropDown}
                    label="Add Currency"
                    stateInputField="targetCurr"
                    updateVal={handleAddCurrCountry}
                    currCountiesCodeMapDetail={currCountiesCodeMapDetail}
                    passInStyle={style.CurrCountriesDropDown}
                    size="small"
                />
            </Box >
            }
        </>
    );
};

const style = {
    divFullScreen: { display: "flex", alignItems: "center", color: "black", fontWeight: 400, marginLeft: "15px" },
    divSmallScreen: { display: "flex", alignItems: "center", color: "black", fontWeight: 400, marginLeft: "10px", padding: "0px" },
    span: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "3px", maxWidth: "200px" },
    CurrCountriesDropDown: { height: "auto" },
    DeleteIcon: { marginRight: "8px" },
    chartDivFullScreen: { width: "70px", height: "40px", float: "right" },
    chartDivSmallScreen: { width: "60px", height: "40px", float: "right", paddingRight: "5px" },
    Tooltip: { margin: "16px" },
    PaperDiv: { display: "flex" },
    NoGapTableContainer: { marginTop: "-15px" }
};

const sxStyle = {
    Box: { width: 1, overflowY: "auto"},
    Paper: { width: 1, boxShadow: "none" },
    Table: { minWidth: 450 },
    TableBody: { width: 1 },
    CurrCountriesDropDown: { minWidth: 150, width: 170, float: "right", ml: 20 },
    TableRow: { '&:last-child td, &:last-child th': { border: 0 } },
    Typography: { flex: '1 1 100%', pl: { sm: 0 }, pr: { xs: 1, sm: 1 }, minHeight: "64px", display: "flex", alignItems: "center", },
    Pageination: { display: "flex", justifyContent: "space-between" }
};