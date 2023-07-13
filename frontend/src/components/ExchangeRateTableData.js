import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CurrCountries from './CurrCountries';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';

export default function ExchangeRateTableData({ currApiDataSet, currApiKeyValuePair }) {
    const initialRows = [
        createCurrLists('USD', 'USD', currApiDataSet),
        createCurrLists('USD', 'CAD', currApiDataSet),
        createCurrLists('USD', 'EUR', currApiDataSet),
        createCurrLists('USD', 'GBP', currApiDataSet),
    ];

    const [currLists, setCurrLists] = useState(initialRows.sort(compare));
    const [newCurrList, setNewCurrList] = useState({ baseCurr: "USD", targetCurr: "" });
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('targetCurr');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(
        function checkNewRow() {
            if (newCurrList.targetCurr !== "" && !currLists.includes(newCurrList.targetCurr)) {
                const currList = createCurrLists('USD', newCurrList.targetCurr, currApiDataSet);
                const newLists = [...currLists, currList];
                setCurrLists(newLists.sort(compare));
            }
        }, [newCurrList]
    );
    
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = currLists.map((n) => n.targetCurr);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, targetCurr) => {
        const selectedIndex = selected.indexOf(targetCurr);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, targetCurr);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

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

    const isSelected = (targetCurr) => selected.indexOf(targetCurr) !== -1;

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

    const handleAddCurrCountries = (e) => {
        setNewCurrList((oldLists) => {
            return { ...oldLists, [e.name]: e.value }
        });
    };

    const handleDelete = () => {
        const oldCurrLists = [...currLists];
        selected.map((targetCurr) => {
            for (let i in oldCurrLists) {
                if (oldCurrLists[i].targetCurr === targetCurr) {
                    oldCurrLists.splice(i, 1)
                }
            }
        })
        setCurrLists(oldCurrLists);
    }

    return (
        <Box sx={sxStyle.Box}>
            <Paper sx={sxStyle.Paper}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    handleDelete={handleDelete}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 450 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={currLists.length}
                        />
                        <TableBody sx={sxStyle.TableBody}>
                            {visibleRows.map((currList, index) => {
                                const isItemSelected = isSelected(currList.targetCurr);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                const imgEmbbedLink = `https://www.countryflagicons.com/SHINY/32/${currList.targetCurr.substring(0, 2)}.png`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, currList.targetCurr)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={currList.targetCurr}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            <div
                                                style={style.div}>
                                                <img
                                                    style={style.img}
                                                    src={imgEmbbedLink}
                                                    alt="" />
                                                <span style={style.span}>{currApiKeyValuePair[currList.targetCurr].name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell align="right">{currList.latestRate}</TableCell>
                                        <TableCell align="right" style={styleTableCell(currList)}>
                                            {getDisplayList(currList)
                                            }
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
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
            <CurrCountries sxStyle={sxStyle.CurrCountries} label="Add Currency" stateInputField="targetCurr" updateVal={handleAddCurrCountries} currApiKeyValuePair={currApiKeyValuePair} passInStyle={{ height: "auto" }} size="small" />
        </Box>
    );
}

function compare(a, b) {
    if (a.targetCurr < b.targetCurr) return -1;
    if (a.targetCurr > b.targetCurr) return 1;
    return 0;
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
    div: { display: "flex", alignItems: "center" },
    img: { margin: "0px 10px 0px 0px" },
    span: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "3px" },
};

const sxStyle = {
    Box: { width: 1 },
    Paper: { width: 1, mb: 2 },
    Table: { width: 1 },
    TableBody: { width: 1 },
    CurrCountries: { minWidth: 150, width: 170, float: "right", ml: 20 },
    TableRow: { '&:last-child td, &:last-child th': { border: 0 } }
}

const styleTableCell = (currList) => {
    if (currList.change >= 0 || currList.change === null) {
        return { color: "green" }
    } else {
        return { color: "red" }
    }
};

const getDisplayList = (currList) => {
    if (currList.change === null) {
        return currList.change;
    } else if (currList.change >= 0) {
        return "+" + currList.change + "%";
    } else {
        return currList.change + "%";
    }
}