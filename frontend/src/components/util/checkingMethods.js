export function checkIfContainsOnlyNumbers (str) {
    return /^[0-9.]+$/.test(str);
}

export function checkIfExist(currLists, targetCurr) {
    for (let el of currLists) {
        if (el.targetCurr === targetCurr) return true;
    }
    return false;
}