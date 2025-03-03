import React from 'react';
import { FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getFlag } from '../../util/getFlag';
import { type CurrCountriesApi, type NewCurrCodeAssigned } from '../../lib/types';

type CurrCountriesDropDownProps = CurrCountriesApi & {
    label: string; // "From" | "To"
    onNewCurrCodeAssigned: (e: NewCurrCodeAssigned) => void;
    isBaseCurrency?: number;
    baseCurrVal?: string;
    sxStyle: React.CSSProperties;
    passInStyle?: React.CSSProperties;
}

export default function CurrCountriesDropDown(props: CurrCountriesDropDownProps) {
    const { label, onNewCurrCodeAssigned, isBaseCurrency = 0, baseCurrVal = "", currCountiesCodeMapDetail, sortedCurrsCodeList, validCurFlagList, 
        sxStyle, passInStyle = { height: "56.5px" } } = props;
    
    // Differentiate the currCode setter base on indexNumber or as boolean in binary
    // The isBaseCurrency will be only use in conversion page (differentiate which dropdown setter refers to)
    const handleChange = (e: SelectChangeEvent): void => onNewCurrCodeAssigned({ isBaseCurrency, value: e.target.value });
    const id = isBaseCurrency === 0 ? "baseCurr" : "targetCurr"

    return (
        <FormControl sx={sxStyle} size="small">
            <InputLabel id={id } >{label}</InputLabel>
            <Select
                labelId={id}
                id={id}
                value={baseCurrVal}
                label={label}
                onChange={handleChange}
                style={passInStyle}
            >
                {sortedCurrsCodeList?.map((targetCurrCode) => (
                    <MenuItem key={targetCurrCode} value={targetCurrCode} >
                        <div style={style.div}>
                            {getFlag(targetCurrCode, validCurFlagList)}
                            <span style={style.span}>{currCountiesCodeMapDetail[targetCurrCode].display}</span>
                        </div>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

const style = {
    div: { display: "flex", alignItems: "center", padding: "0" },
    divGetFlag: {
        backgroundColor: "#dddbdb", border: "1px solid #b7b6b6", margin: "3.5px 10px 3.5px 0px",
        borderRadius: "1px", fontSize: "0.75rem", height: "22.5px", padding: "2px 3px",
        width: "31.5px", textAlign: "center",
    },
    span: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "1.5px" },
}