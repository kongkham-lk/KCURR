import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useState } from 'react';

export default function ExchagneRateTableData({ currData }) {

    const initialRow = [
        createData('USD', 'USD', currData),
        createData('USD', 'CAD', currData),
        createData('USD', 'EUR', currData),
        createData('USD', 'GBP', currData),
    ];

    const [rows, setRows] = useState(initialRow);

    function createData(baseCurr, targetCurr, currData) {
        let lastestRate;
        let histRate;
        let change;
        if (baseCurr !== targetCurr) {
            lastestRate = currData[0][targetCurr];
            histRate = currData[1][targetCurr];
            change = (lastestRate - histRate) * 100 / histRate;
            console.log(`target: ${targetCurr}, lastestRate: ${lastestRate}, change: ${change}`);
            return { targetCurr, lastestRate, change: change.toFixed(2) };
        } else {
            return { targetCurr: baseCurr, lastestRate: 1, change: null };
        }
    }

    return (
        <TableBody>
            {rows.map((row) => (
                <TableRow
                    key={row.targetCurr}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        {row.targetCurr}
                    </TableCell>
                    <TableCell align="right">{row.lastestRate}</TableCell>
                    <TableCell align="right" style={row.change >= 0 || row.change === null ? { color: "green" } : { color: "red" }}>{row.change === null ? row.change : (row.change >= 0) ? "+" + row.change + "%" : row.change + "%"}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
};