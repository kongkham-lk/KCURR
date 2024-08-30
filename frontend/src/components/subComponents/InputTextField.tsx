import React, { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';

type InputTextFieldProps = {
    onConvertAmountUpdate:(e: HTMLTextAreaElement) => void;
    isError: boolean;
    inputFieldLabel: string;
    placeHolder: string;
    size: "medium" | "small";
    displayInput: string;
}

export default function InputTextField(props: InputTextFieldProps) {
    const { onConvertAmountUpdate, isError = false, inputFieldLabel, placeHolder, size = "medium", displayInput } = props;

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => { onConvertAmountUpdate(e.target) };

    return (
        <TextField
            error={isError ? true : false}
            label={inputFieldLabel.charAt(0).toUpperCase() + inputFieldLabel.substring(1)}
            id={inputFieldLabel}
            name={inputFieldLabel}
            placeholder={placeHolder}
            sx={sxStyle.TextField}
            size={size}
            onChange={handleChange}
            value={displayInput}
        />
    )
};

const sxStyle = { TextField: { width: '-webkit-fill-available' } };