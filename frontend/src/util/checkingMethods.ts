import { type CurrList } from "../lib/types";

export function checkIfContainsOnlyNumbers(str: string): boolean {
    return /^[0-9.]+$/.test(str);
}

export function checkIfContainsMoreThanOneDot(str: string): boolean {
    return /\.\.[^.]*$/.test(str);
}

export function checkIfExist(currCodes: string[], targetCurr: string): boolean {
    for (let el of currCodes) {
        if (el === targetCurr) return true;
    }
    return false;
}