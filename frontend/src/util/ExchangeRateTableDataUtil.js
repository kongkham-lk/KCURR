import { retrieveExchangeRates } from "./apiClient";
import { createCurrLists } from "./createCurrLists";

export function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
    if (array === null || array === undefined)
        return array;

    // Create an array of tuples, where each tuple contains an element from the original array and its index.
    const stabilizedArray = Array.from({ length: array.length }, (v, i) => [array[i], i]);

    // console.log("array: ", array)
    // console.log("stabilizedArray: ", stabilizedArray)

    // Sort the array of tuples using the provided comparator.
    stabilizedArray.sort((a, b) => {
        const order = comparator(a[0], b[0]); // Compare the original elements.

        // console.log(" a: ", a)
        // console.log(" b: ", b)
        // console.log(" order: ", order)

        if (order !== 0) {
            return order; // If they are not equal, return the comparison result.
        }

        // console.log(" a[1] - b[1]: ", a[1] - b[1])
        return a[1] - b[1]; // If they are equal, compare their original index to maintain stability.
    });

    // console.log(" stabilizedArray: ", stabilizedArray);

    // Extract the original elements from the sorted tuples and return the sorted array.
    return stabilizedArray.map((el) => el[0]);
}

export function styleTableCell(currList, isDisplaySM, updateColor = true) {
    let paddingVal = isDisplaySM ? "0px" : "16px"
    if (currList.change >= 0 || currList.change === null) {
        return { color: updateColor && "green", padding: paddingVal, ...style.borderNone }
    } else {
        return { color: updateColor && "red", padding: paddingVal, ...style.borderNone }
    }
};

export function styleTableRow(currKey, defaultCurr) {
    if (currKey === defaultCurr) {
        return {
            backgroundColor: "#1876d259", backgroundClip: "border-box",
            outline: "7px solid white", outlineOffset: "-2px",
            borderRadius: "13px", verticalAlign: 'middle',
        }
    } else {
        return {
            backgroundColor: "transparent", backgroundClip: "border-box",
            outline: "7px solid transparent", outlineOffset: "-2px",
            borderRadius: "13px", verticalAlign: 'middle',
            borderTop: '1px solid rgba(224, 224, 224, 1)'
        }
    }
}

export function getDisplayList(currList) {
    if (currList.change === null) {
        return currList.change;
    } else if (currList.change >= 0) {
        return "+" + currList.change + "%";
    } else {
        return currList.change + "%";
    }
}

const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function styleTableRowInFile(dense, emptyRows) {
    return { height: (dense ? 33 : 53) * emptyRows, ...style.borderNone }
};

export function styleTableCellDelete(targetCurr, defaultCurr, isDisplaySM) {
    if (targetCurr !== defaultCurr) {
        return { width: "10%", color: "rgba(0, 0, 0, 0.54)", paddingLeft: isDisplaySM && "5px", paddingRight: isDisplaySM && "0px", ...style.borderNone };
    } else {
        return { width: "10%", color: "transparent", paddingLeft: isDisplaySM && "5px", paddingRight: isDisplaySM && "0px", ...style.borderNone };
    }
};

// invoke when the live rate table use exchange rate data instead of timeSeries
export function getDayRangeDate(offsetDate) {
    const date = getEntireDateString(offsetDate)
    return date.substring(0, 6);
}

// invoke when the live rate table use exchange rate data instead of timeSeries
export function getMonthRangeDate(offsetDate) {
    return getEntireDateString(offsetDate);
}

const getEntireDateString = (offsetDate) => {
    offsetDate *= 1000 * 60 * 60 * 24
    const date = new Date(Date.now() - offsetDate);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      }) + "";
}

const style = {
    borderNone: { border: 'none' },
};
