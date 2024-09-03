import { type CurrList } from "../lib/types";

export function checkIfContainsOnlyNumbers(str: string): boolean {
    return /^[0-9.]+$/.test(str);
}

export function checkIfContainsMoreThanOneDot(str: string): boolean {
    return /\.\.[^.]*$/.test(str);
}

export function checkIfExist(currLists: CurrList[], targetCurr: string): boolean {
    for (let el of currLists) {
        if (el.targetCurr === targetCurr) return true;
    }
    return false;
}