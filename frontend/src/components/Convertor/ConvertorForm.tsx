import React, { FormEvent, useState } from 'react';
import Button from '@mui/material/Button';
import InputTextField from '../subComponents/InputTextField';
import CurrCountriesDropDown from '../subComponents/CurrCountriesDropDown';
import { checkIfContainsOnlyNumbers } from '../../util/checkingMethods';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { type NewCurrCodeAssigned, type DisplayFlags, type CurrCountriesApi } from '../../lib/types';

type ConvertorFormProps = DisplayFlags & Omit<CurrCountriesApi, "isReady"> & {
    onConversionFormDataSubmit: (ConvertAmount: number) => Promise<void>;
    targetConvertCurrPair: string[];
    onConvertCurrSwap: () => void;
    onNewCurrCodeAssigned: (e: NewCurrCodeAssigned) => void;
}

export default function ConvertorForm(props: ConvertorFormProps) {
    const { onConversionFormDataSubmit, targetConvertCurrPair, isDisplaySM, onConvertCurrSwap, onNewCurrCodeAssigned } = props;
    const [targetConvertAmount, setTargetConvertAmount] = useState(0.0);
    const [isError, setIsError] = useState(false);

    // Store new user input for conversion amount
    const handleConvertAmountUpdate = (e: HTMLTextAreaElement): void => {
        if (checkIfContainsOnlyNumbers(e.value) || e.value === "") {
            setIsError(false);
        } else {
            setIsError(true);
        }

        // The total amount to convert
        const convertAmountInput: number = parseFloat(e.value);

        // Determined if the input value is valid or user just delete all and no new value input
        if (!isNaN(convertAmountInput))
            setTargetConvertAmount(convertAmountInput);
        else
            setTargetConvertAmount(0);
    }

    // Submit form to start runniing the conversion logic
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onConversionFormDataSubmit(targetConvertAmount);
    };

    const commonAttr = {
        sxStyle: sxStyle.CurrCountriesDropDown,
        onNewCurrCodeAssigned
    }

    const attr = {
        InputTextField: {
            onConvertAmountUpdate: handleConvertAmountUpdate,
            isError,
            inputFieldLabel: "amount",
            placeHolder: "Enter Number",
            displayInput: targetConvertAmount,
        },
        baseCurr: {
            label: "From",
            isBaseCurrency: 0,
            baseCurrVal: targetConvertCurrPair[0],
            ...commonAttr,
            ...props
        },
        targetCurr: {
            label: "To",
            isBaseCurrency: 1,
            baseCurrVal: targetConvertCurrPair[1],
            ...commonAttr,
            ...props
        },
    };

    const targetFormStyling = isDisplaySM ? sxStyle.FormShrink : sxStyle.FormExpand

    return (
        <form onSubmit={onSubmit} >
            <div style={targetFormStyling}>
                <InputTextField {...attr.InputTextField} />
                <CurrCountriesDropDown {...attr.baseCurr} />
                <Button variant="outlined" type="submit" onClick={onConvertCurrSwap} sx={sxStyle.swapButton} disabled={isError ? true : false} >
                    {isDisplaySM ? <SwapVertIcon /> : <SwapHorizIcon />}
                </Button>
                <CurrCountriesDropDown {...attr.targetCurr} />
            </div>
            <Button variant="contained" type="submit" style={style.convertButton} disabled={isError ? true : false} >
                Convert
            </Button>
        </form >
    )
};

const style = {
    convertButton: { marginTop: "18px" },
    div: { marginTop: "1%" },
};

const sxStyle = {
    CurrCountriesDropDown: { minWidth: 1 / 4, width: 'auto' },
    FormExpand: {
        display: "flex", alignItems: "center", flexWrap: "nowrap" as const, flexDirection: "row" as const, justifyContent: "space-between",
        gap: "10px", padding: "0",
    },
    FormShrink: {
        display: "flex", flexWrap: "nowrap" as const, flexDirection: "column" as const, justifyContent: "space-between",
        gap: "20px", padding: "0",
    },
    swapButton: { borderRadius: "32px", width: "50px", height: "50px", borderColor: "#afaeae", minWidth: "50px" },
};