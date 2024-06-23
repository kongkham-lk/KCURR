import { useState } from 'react';
import Button from '@mui/material/Button';
import InputTextField from '../InputTextField';
import CurrCountriesDropDown from '../CurrCountriesDropDown';
import { checkIfContainsOnlyNumbers } from '../../util/checkingMethods';
import { retrieveConvertValue } from '../../util/apiClient';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';

export default function ConvertorForm(props) {
    const { setFormDataToConvertor, currCountiesCodeMapDetail, sortedCurrsCodeList, validCurFlagList, currInput, isDisplaySM } = props;

    const [formInputs, setFormInputs] = useState({ amount: 0, baseCurr: currInput.baseCurr, targetCurr: currInput.targetCurr });
    const [isError, setIsError] = useState(false);

    const handleAmountInput = (e) => {
        if (checkIfContainsOnlyNumbers(e.value) || e.value === "") {
            setIsError(false);
        } else {
            setIsError(true);
        }

        const convertAmountInput = parseFloat(e.value);

        setFormInputs((oldFormInputs) => {
            return {
                ...oldFormInputs,
                [e.name]: convertAmountInput,
            };
        });
    }

    const handleCurrCountryForm = (e) => {
        setFormInputs((oldFormInputs) => {
            return {
                ...oldFormInputs,
                [e.name]: e.value,
            };
        });
    };

    const handleSwap = () => {
        const { amount, baseCurr, targetCurr } = formInputs;
        const newFormInput = { amount: amount, baseCurr: targetCurr, targetCurr: baseCurr };
        setFormInputs(newFormInput);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        retrieveConvertValue(setFormDataToConvertor, formInputs);
    };

    const commonAttr = {
        sxStyle: sxStyle.CurrCountriesDropDown,
        updateVal: handleCurrCountryForm,
        currCountiesCodeMapDetail,
        sortedCurrsCodeList, 
        validCurFlagList
    }

    const attr = {
        baseCurr: {
            label: "From",
            stateInputField: "baseCurr",
            baseCurrVal: formInputs.baseCurr,
            ...commonAttr
        },
        targetCurr: {
            label: "To",
            stateInputField: "targetCurr",
            baseCurrVal: formInputs.targetCurr,
            ...commonAttr
        },
    };

    return (
        <form onSubmit={onSubmit} >
            <div spacing={3} style={isDisplaySM ? sxStyle.FormShrink : sxStyle.FormExpand} flexdirection={isDisplaySM ? "column" : "row"}>
                <InputTextField updateVal={handleAmountInput} isError={isError} baseCurr={formInputs.baseCurr} currCountiesCodeMapDetail={currCountiesCodeMapDetail} inputFieldLabel="amount" placeHolder="Enter Number" />
                <CurrCountriesDropDown {...attr.baseCurr} />
                <Button variant="outlined" type="submit" onClick={handleSwap} sx={sxStyle.swapButton} disabled={isError ? true : false} >
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
        display: "flex", alignItems: "center", flexWrap: "nowrap", flexDirection: "row", justifyContent: "space-between",
        gap: "10px", padding: "0",
    },
    FormShrink: {
        display: "flex", flexWrap: "nowrap", flexDirection: "column", justifyContent: "space-between",
        gap: "20px", padding: "0",
    },
    swapButton: { borderRadius: "32px", width: "50px", height: "50px", borderColor: "#afaeae", minWidth: "50px" },
};