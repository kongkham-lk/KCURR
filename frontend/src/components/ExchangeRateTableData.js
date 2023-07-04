import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useState, useEffect } from 'react';

function createData(baseCurr, targetCurr, currDataSet) {
    let lastestRate;
    let histRate;
    let change;
    if (baseCurr !== targetCurr) {
        lastestRate = currDataSet[0][targetCurr];
        histRate = currDataSet[1][targetCurr];
        change = (lastestRate - histRate) * 100 / histRate;
        return { targetCurr, lastestRate, change: change.toFixed(2) };
    } else {
        return { targetCurr: baseCurr, lastestRate: 1, change: null };
    }
}

export default function ExchagneRateTableData({ currDataSet, newRow, currKeyValue }) {
    const initialRow = [
        createData('USD', 'USD', currDataSet),
        createData('USD', 'CAD', currDataSet),
        createData('USD', 'EUR', currDataSet),
        createData('USD', 'GBP', currDataSet),
    ];

    const [rows, setRows] = useState(initialRow);
    const [fakeChange, setFakeChange] = useState({});

    useEffect(
        function checkNewRow() {
            if (newRow.targetCurr !== "" && !rows.includes(newRow.targetCurr)) {
                const row = createData('USD', newRow.targetCurr, currDataSet);
                const newRows = [...rows, row];
                setRows(newRows);
                setFakeChange((newFake) => {
                    return { ...newFake, [newRow.targetCurr]: ((Math.random() * 4) - 2).toFixed(2) }
                });
            }
        }, [newRow]
    );

    return (
        <TableBody>
            {rows.map((row) => (
                <TableRow
                    key={row.targetCurr}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        <div style={{ display: "flex", alignItems: "center", }}>
                            <img
                                style={{ margin: "0 10px 0px 0px" }}
                                src={`https://www.countryflagicons.com/SHINY/32/${row.targetCurr.substring(0, 2)}.png`}
                                alt="" />
                            <span style={{
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "3px"
                            }}>{currKeyValue[row.targetCurr]}</span>
                        </div>
                    </TableCell>
                    <TableCell align="right">{row.lastestRate}</TableCell>
                    <TableCell
                        align="right"
                        style={row.change >= 0 || row.change === null || fakeChange[row.targetCurr] >= 0
                            ? { color: "green" } : { color: "red" }}>
                        {row.change === null ? row.change
                            : row.change >= 0 ? "+" + row.change + "%"
                                : row.change < 0 ? row.change + "%"
                                    : fakeChange[row.targetCurr] >= 0 ? "+" + fakeChange[row.targetCurr] + "%"
                                        : fakeChange[row.targetCurr] + "%"
                        }
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
};