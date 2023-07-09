import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useState, useEffect } from 'react';

export default function ExchangeRateTableData({ currApiDataSet, newCurrList, currApiKeyValuePair }) {
    const initialRow = [
        createCurrLists('USD', 'USD', currApiDataSet),
        createCurrLists('USD', 'CAD', currApiDataSet),
        createCurrLists('USD', 'EUR', currApiDataSet),
        createCurrLists('USD', 'GBP', currApiDataSet),
    ];

    const [currLists, setCurrLists] = useState(initialRow);
    const [fakeRecords, setFakeRecords] = useState({});

    console.log("currLists =>", currLists)

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
            {currLists.map((currList) => (
                <TableRow
                    key={currList.targetCurr}
                    sx={sxStyle.TableRow}
                >
                    <TableCell component="th" scope="row">
                        <div style={style.div}>
                            <img
                                style={style.img}
                                src={`https://www.countryflagicons.com/SHINY/32/${currList.targetCurr.substring(0, 2)}.png`}
                                alt="" />
                            <span style={style.span}>{currApiKeyValuePair[currList.targetCurr]}</span>
                        </div>
                    </TableCell>
                    <TableCell align="left">{currList.latestRate}</TableCell>
                    <TableCell
                        align="left"
                        style={currList.change >= 0 || currList.change === null || fakeRecords[currList.targetCurr] >= 0
                            ? { color: "green" } : { color: "red" }}>
                        {currList.change === null ? currList.change
                            : currList.change >= 0 ? "+" + currList.change + "%"
                                : currList.change + "%"
                        }
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
};

function createCurrLists(baseCurr, targetCurr, currApiDataSet) {
    const latestRates = currApiDataSet[0];
    const histRates = currApiDataSet[1];
    if (baseCurr === targetCurr) {
        return { targetCurr: baseCurr, latestRate: 1, change: null };
    } else {
        console.log("latestRates => ", latestRates )
        console.log("histRates => ", histRates)
        const latestRate = latestRates[targetCurr];
        const histRate = histRates[targetCurr];
        console.log("latestRates result => ", latestRate)
        console.log("histRates result => ", histRate)
        const change = (latestRate - histRate) * 100 / histRate;
        console.log("change => ", change)
        return { targetCurr, latestRate:latestRate.toFixed(4), change: change.toFixed(2) };
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