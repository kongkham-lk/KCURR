import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useState, useEffect } from 'react';

function createCurrLists(baseCurr, targetCurr, currApiDataSet) {
    let lastestRate;
    let histRate;
    let change;
    if (baseCurr !== targetCurr) {
        lastestRate = currApiDataSet[0][targetCurr];
        histRate = currApiDataSet[1][targetCurr];
        change = (lastestRate - histRate) * 100 / histRate;
        return { targetCurr, lastestRate, change: change.toFixed(2) };
    } else {
        return { targetCurr: baseCurr, lastestRate: 1, change: null };
    }
}

const style = {
    div: { display: "flex", alignItems: "center", },
    img: { margin: "0 10px 0px 0px" },
    span: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "3px" },
};

const sxStyle = {
    TableRow: { '&:last-child td, &:last-child th': { border: 0 } }
}

export default function ExchangeRateTableData({ currApiDataSet, newCurrList, currApiKeyValuePair }) {
    const initialRow = [
        createCurrLists('USD', 'USD', currApiDataSet),
        createCurrLists('USD', 'CAD', currApiDataSet),
        createCurrLists('USD', 'EUR', currApiDataSet),
        createCurrLists('USD', 'GBP', currApiDataSet),
    ];

    const [currLists, setCurrLists] = useState(initialRow);
    const [fakeRecords, setFakeRecords] = useState({});

    useEffect(
        function checkNewRow() {
            if (newCurrList.targetCurr !== "" && !currLists.includes(newCurrList.targetCurr)) {
                const currList = createCurrLists('USD', newCurrList.targetCurr, currApiDataSet);
                const newLists = [...currLists, currList];
                setCurrLists(newLists);
                setFakeRecords((newFakeRecords) => {
                    return { ...newFakeRecords, [newCurrList.targetCurr]: ((Math.random() * 4) - 2).toFixed(2) }
                });
            }
        }, [newCurrList]
    );

    return (
        <TableBody>
            {currLists.map((row) => (
                <TableRow
                    key={row.targetCurr}
                    sx={sxStyle.TableRow}
                >
                    <TableCell component="th" scope="row">
                        <div style={style.div}>
                            <img
                                style={style.img}
                                src={`https://www.countryflagicons.com/SHINY/32/${row.targetCurr.substring(0, 2)}.png`}
                                alt="" />
                            <span style={style.span}>{currApiKeyValuePair[row.targetCurr]}</span>
                        </div>
                    </TableCell>
                    <TableCell align="right">{row.lastestRate}</TableCell>
                    <TableCell
                        align="right"
                        style={row.change >= 0 || row.change === null || fakeRecords[row.targetCurr] >= 0
                            ? { color: "green" } : { color: "red" }}>
                        {row.change === null ? row.change
                            : row.change >= 0 ? "+" + row.change + "%"
                                : row.change < 0 ? row.change + "%"
                                    : fakeRecords[row.targetCurr] >= 0 ? "+" + fakeRecords[row.targetCurr] + "%"
                                        : fakeRecords[row.targetCurr] + "%"
                        }
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
};