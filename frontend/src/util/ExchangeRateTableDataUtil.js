export function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export function styleTableCell(currList) {
    if (currList.change >= 0 || currList.change === null) {
        return { color: "green" }
    } else {
        return { color: "red" }
    }
};

export function styleTableRow(currKey, defaultCurr) {
    if (currKey === defaultCurr) {
        return {
            backgroundColor: "#cbeafc", backgroundClip: "border-box",
            outline: "10px solid white", outlineOffset: "-2px",
            borderRadius: "13px",
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

export function styleTableRowInFile (dense, emptyRows) {
    return { height: (dense ? 33 : 53) * emptyRows }
};

export function styleTableCellDelete (targetCurr, defaultCurr) { 
    if (targetCurr !== defaultCurr) {
        return { width: "10%", color: "rgba(0, 0, 0, 0.54)" };
    } else {
        return { width: "10%", color: "transparent" };
    }
};
