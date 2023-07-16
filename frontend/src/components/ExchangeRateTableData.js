import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import CurrCountries from './CurrCountries';
import EnhancedTableHead from './EnhancedTableHead';
import axios from 'axios';

export default function ExchangeRateTableData({ currApiDataSet, currApiKeyValuePair }) {
    const [currDataSet, setCurrDataSet] = useState([...currApiDataSet]);

    const [defaultCurr, setDefaultCurr] = useState("USD");

    const initialRows = [
        createCurrLists(defaultCurr, 'USD', currDataSet),
        createCurrLists(defaultCurr, 'CAD', currDataSet),
        createCurrLists(defaultCurr, 'EUR', currDataSet),
        createCurrLists(defaultCurr, 'GBP', currDataSet),
    ];

    const [currLists, setCurrLists] = useState(initialRows);
    const [newCurr, setNewCurr] = useState("");
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('');
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(
        function checkNewRow() {
            if (newCurr !== "" && !currLists.includes(newCurr)) {
                const currList = createCurrLists(defaultCurr, newCurr, currDataSet);
                const newLists = [...currLists, currList];
                setNewCurr("");
                setCurrLists(newLists)
            }
        }, [newCurr, currLists, currDataSet, defaultCurr]
    );

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSetDefault = async (targetCurr) => {
        const oldLists = [];
        const newLists = [];
        const initialValue = { baseCurr: targetCurr };
        const resExchangeRatesLast = await axios.post('http://localhost:8080/curr/rate-latest', initialValue);
        const resExchangeRatesHist = await axios.post('http://localhost:8080/curr/rate-hist', initialValue);
        const newCurrDataSet = [resExchangeRatesLast.data, resExchangeRatesHist.data];

        for (let i in currLists) {
            if (currLists[i].targetCurr !== targetCurr) {
                oldLists.push(currLists[i].targetCurr);
            }
        }
        oldLists.unshift(targetCurr)

        for (let i in oldLists) {
            newLists[i] = createCurrLists(targetCurr, oldLists[i], newCurrDataSet);
        }

        setCurrLists(newLists);
        setDefaultCurr(targetCurr);
        setCurrDataSet(newCurrDataSet);
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

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - currLists.length) : 0;

    const visibleRows = useMemo(
        () =>
            stableSort(currLists, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [currLists, order, orderBy, page, rowsPerPage],
    );

    const handleAddCurrCountries = (e) => setNewCurr(e.value);

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

    console.log("currLists => ", currLists)

    return (
        <Box sx={sxStyle.Box}>
            <Paper sx={sxStyle.Paper}>
                <div style={{ display: "flex" }}>
                    <Typography
                        sx={sxStyle.Typography}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Exchange Rate Listing
                    </Typography>
                    <Tooltip title="Reset Filter" style={{ margin: "16px" }} onClick={handleResetFilter}>
                        <IconButton>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 450 }}
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
                                const currKey = currList.targetCurr;
                                const labelId = `enhanced-table-checkbox-${index}`;
                                const imgEmbbedLink = `https://www.countryflagicons.com/SHINY/32/${currKey.substring(0, 2)}.png`;

                                return (
                                    <TableRow
                                        // hover
                                        key={currKey} style={styleTableRow(currKey, defaultCurr)}
                                    >
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            <Button variant="text" style={style.div} onClick={() => handleSetDefault(currKey)} >
                                                <img
                                                    style={style.img}
                                                    src={imgEmbbedLink}
                                                    alt="" />
                                                <span style={style.span}>{currApiKeyValuePair[currKey].display}</span>
                                            </Button>
                                        </TableCell>
                                        <TableCell align="right" >{currList.latestRate}</TableCell>
                                        <TableCell align="right" style={styleTableCell(currList, defaultCurr)}>
                                            {currList.change === "NaN" ? "Currenctly Not Avalable" : getDisplayList(currList)}
                                        </TableCell >
                                        {<TableCell
                                            align="right"
                                            style={{width: "10%", color: currKey !== defaultCurr ? "rgba(0, 0, 0, 0.54)" : "transparent" }}
                                            onClick={() => handleDelete(currKey)}
                                        >
                                            <DeleteIcon style={{marginRight: "8px"}}/>
                                        </TableCell>}
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }} >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={currLists.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
            <CurrCountries
                sxStyle={sxStyle.CurrCountries}
                label="Add Currency"
                stateInputField="targetCurr"
                updateVal={handleAddCurrCountries}
                currApiKeyValuePair={currApiKeyValuePair}
                passInStyle={{ height: "auto" }}
                size="small"
            />
        </Box>
    );
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function createCurrLists(baseCurr, targetCurr, currApiDataSet) {
    const latestRates = currApiDataSet[0];
    const histRates = currApiDataSet[1];
    if (baseCurr === targetCurr) {
        return { targetCurr: baseCurr, latestRate: 1, change: null };
    } else {
        const latestRate = latestRates[targetCurr];
        const histRate = histRates[targetCurr];
        const change = (latestRate - histRate) * 100 / histRate;
        return { targetCurr, latestRate: latestRate?.toFixed(4), change: change?.toFixed(2) };
    }
}

const style = {
    div: {
        display: "flex",
        alignItems: "center",
        color: "black",
        fontWeight: 400,
        marginLeft: "15px"
    },
    img: { margin: "0px 10px 0px 0px" },
    span: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginTop: "3px",
        maxWidth: "200px",
    },
};

const sxStyle = {
    Box: { width: 1 },
    Paper: { width: 1, mb: 2 },
    Table: { width: 1 },
    TableBody: { width: 1 },
    CurrCountries: { minWidth: 150, width: 170, float: "right", ml: 20 },
    TableRow: { '&:last-child td, &:last-child th': { border: 0 } },
    Typography: {
        flex: '1 1 100%',
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        minHeight: "64px",
        display: "flex",
        alignItems: "center"
    },
}

const styleTableCell = (currList) => {
    if (currList.change >= 0 || currList.change === null) {
        return { color: "green" }
    } else {
        return { color: "red" }
    }
};

const styleTableRow = (currKey, defaultCurr) => {
    if (currKey === defaultCurr)  {
        return {
            backgroundColor: "#cbeafc",
            backgroundClip: "border-box",
            outline: "10px solid white",
            outlineOffset: "-5px",
            borderRadius: "13px",
        }
    }
}

const getDisplayList = (currList) => {
    if (currList.change === null) {
        return currList.change;
    } else if (currList.change >= 0) {
        return "+" + currList.change + "%";
    } else {
        return currList.change + "%";
    }
}