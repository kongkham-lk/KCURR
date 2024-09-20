import { type CurrList, type Order } from "../lib/types";

export function getComparator(order: Order, orderBy: string, currList: CurrList): (a: CurrList, b: CurrList) => number {
    // Do not sort if currList is not ready
    if (currList === undefined || currList === null)
        return (a: CurrList, b: CurrList) => 0;

    // Type guard to check if orderBy is a valid key of CurrList
    if (Object.keys(currList).includes(orderBy)) {
        // Now, we are certain that orderBy is a keyof CurrList
        const orderByField: keyof CurrList = orderBy as keyof CurrList;
        return order === 'desc'
            ? (a: CurrList, b: CurrList) => descendingComparator(a[orderByField], b[orderByField])
            : (a: CurrList, b: CurrList) => -descendingComparator(a[orderByField], b[orderByField]);
    } else if (orderBy === "") { // clear filter
        return (a: CurrList, b: CurrList) => 0;
    } else { // pass in keyword other than col name
        console.error(`${orderBy} is not a valid key of CurrList`);
        return (a: CurrList, b: CurrList) => 0;
    }
}

export function stableSort(currLists: CurrList[], comparator: (a: CurrList, b: CurrList) => number): CurrList[] {
    // console.log(currLists)
    if (currLists === null || currLists === undefined )
        return currLists;

    // Create an array of tuples, where each tuple contains an element from the original array and its index.
    const stabilizedArray: [CurrList, number][] = Array.from({ length: currLists.length }, (v, i) => [currLists[i], i]);

    // Sort the array of tuples using the provided comparator.
    stabilizedArray.sort((a: [CurrList, number], b: [CurrList, number]) => {
        const order = comparator(a[0], b[0]); // Compare the original elements.

        if (order !== 0) {
            return order; // If they are not equal, return the comparison result.
        }
        return a[1] - b[1]; // If they are equal, compare their original index to maintain stability.
    });

    // Extract the original elements from the sorted tuples and return the sorted array.
    return stabilizedArray.map((el) => el[0]);
}

export function styleTableCell(currList: CurrList, isDisplaySM: boolean, updateColor = true) {
    let paddingVal = isDisplaySM ? "0px" : "16px"
    if (currList.change !== null && currList.change !== undefined && parseFloat(currList.change) >= 0) {
        return { color: updateColor ? "green" : "black", padding: paddingVal, ...style.borderNone }
    } else {
        return { color: updateColor ? "red" : "black", padding: paddingVal, ...style.borderNone }
    }
};

export function styleTableRow(currKey: string, defaultCurr: string) {
    if (currKey === defaultCurr) {
        return {
            backgroundColor: "#1876d2", backgroundClip: "border-box", verticalAlign: 'middle',
        }
    } else {
        return {
            backgroundColor: "transparent", backgroundClip: "border-box",
            verticalAlign: 'middle', borderTop: '1px solid rgba(224, 224, 224, 1)'
        }
    }
}

export function getDisplayList(currList: CurrList) {
    if (currList.change !== null && currList.change !== undefined) {
        if (parseFloat(currList.change) >= 0)
            return "+" + currList.change + "%";
        else
            return currList.change + "%";
    } else
        return currList.change;
}

// the passing in param, 'a' and 'b', need to set as "any" type since they can be any field's value within CurrList (string or number)
const descendingComparator = (a: any, b: any) => {
    if (b < a)
        return -1;
    else if (b > a)
        return 1;
    else
        return 0;
}

export function styleTableRowInFile(dense: boolean, emptyRows: number) {
    return { height: (dense ? 33 : 53) * emptyRows, ...style.borderNone }
};

export function styleTableCellDelete(targetCurr: string, defaultCurr: string, isDisplaySM: boolean) {
    if (targetCurr !== defaultCurr) {
        return {
            width: "10%", color: "rgba(0, 0, 0, 0.54)", paddingLeft: isDisplaySM ? "5px" : "auto",
            paddingRight: isDisplaySM ? "0px" : "auto", ...style.borderNone
        };
    } else {
        return {
            width: "10%", color: "transparent", paddingLeft: isDisplaySM ? "5px" : "auto",
            paddingRight: isDisplaySM ? "0px" : "auto", ...style.borderNone
        };
    }
};

// Invoke when the live rate table use exchange rate data instead of timeSeries
export function getDayRangeDate(offsetDate: number) {
    const date = getEntireDateString(offsetDate)
    return date.substring(0, 6);
}

// Invoke when the live rate table use exchange rate data instead of timeSeries
export function getMonthRangeDate(offsetDate: number) {
    return getEntireDateString(offsetDate);
}

const getEntireDateString = (offsetDate: number) => {
    offsetDate *= 1000 * 60 * 60 * 24
    const date = new Date(Date.now() - offsetDate);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    }) + "";
}

const style = {
    borderNone: { border: 'none' },
};
