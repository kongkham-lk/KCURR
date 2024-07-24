import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function InputTextField(props) {
    const { updateVal, isError = false, inputFieldLabel, placeHolder, size = "large", displayInput } = props;

    const handleChange = (e) => { updateVal(e.target) };

    return (
        <TextField
            required
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