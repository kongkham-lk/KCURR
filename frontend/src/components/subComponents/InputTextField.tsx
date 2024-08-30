import TextField from '@mui/material/TextField';

export default function InputTextField(props) {
    const { onConvertAmountUpdate, isError = false, inputFieldLabel, placeHolder, size = "large", displayInput } = props;

    const handleChange = (e) => { onConvertAmountUpdate(e.target) };

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