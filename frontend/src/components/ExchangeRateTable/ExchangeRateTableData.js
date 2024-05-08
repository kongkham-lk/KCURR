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
import FilterListIcon from '@mui/icons-material/FilterList';
import CurrCountriesDropDown from '../CurrCountriesDropDown';
import EnhancedTableHead from './EnhancedTableHead';
import { getComparator, stableSort, styleTableCell, styleTableRow, getDisplayList } from '../../util/ExchangeRateTableDataUtil';
import { checkIfExist } from '../../util/checkingMethods';
import { createCurrLists } from '../../util/createCurrLists';
import { getFlag } from '../../util/getFlag';
import { retrieveExchangeRates } from '../../util/apiClient';

export default function ExchangeRateTableData(props) {
    const { currApiDataSet, currCountiesCodeMapDetail } = props;

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
            if (newCurr !== "" && !checkIfExist(currLists, newCurr)) {
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
            newLists[i] = createCurrLists(targetCurr, oldLists[i], newAddCurrDataSet);
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
                                const targetCurr = currList.targetCurr;
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow key={targetCurr} style={styleTableRow(targetCurr, defaultCurr)} >
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            <Button variant="text" style={style.div} onClick={() => handleSetDefaultCurr(targetCurr)} >
                                                {getFlag(targetCurr)}
                                                <span style={style.span}>{currCountiesCodeMapDetail[targetCurr].display}</span>
                                            </Button>
                                        </TableCell>
                                        <TableCell align="right" >{currList.latestRate}</TableCell>
                                        <TableCell align="right" style={styleTableCell(currList, defaultCurr)}>
                                            {currList.change === "NaN" ? "Currenctly Not Avalable" : getDisplayList(currList)}
                                        </TableCell>
                                        {<TableCell
                                            align="right"
                                            style={{ width: "10%", color: targetCurr !== defaultCurr ? "rgba(0, 0, 0, 0.54)" : "transparent" }}
                                            onClick={() => handleDelete(targetCurr)}
                                        >
                                            <DeleteIcon style={style.DeleteIcon} />
                                        </TableCell>}
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
            <CurrCountriesDropDown
                sxStyle={sxStyle.CurrCountriesDropDown}
                label="Add Currency"
                stateInputField="targetCurr"
                updateVal={handleAddCurrCountry}
                currCountiesCodeMapDetail={currCountiesCodeMapDetail}
                passInStyle={style.CurrCountriesDropDown}
                size="small"
            />
        </Box>
    );
};

const style = {
    div: { display: "flex", alignItems: "center", color: "black", fontWeight: 400, marginLeft: "15px" },
    span: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "3px", maxWidth: "200px" },
    CurrCountriesDropDown: { height: "auto" },
    DeleteIcon: { marginRight: "8px" },
};

const sxStyle = {
    Box: { width: 1 },
    Paper: { width: 1, mb: 2 },
    Table: { width: 1 },
    TableBody: { width: 1 },
    CurrCountriesDropDown: { minWidth: 150, width: 170, float: "right", ml: 20 },
    TableRow: { '&:last-child td, &:last-child th': { border: 0 } },
    Typography: { flex: '1 1 100%', pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, minHeight: "64px", display: "flex", alignItems: "center" },
}

const styleTableRowInFile = (dense, emptyRows) => {
    return { height: (dense ? 33 : 53) * emptyRows }
}