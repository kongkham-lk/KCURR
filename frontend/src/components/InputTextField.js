import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function InputTextField(props) {
    const { updateVal, isError = false, baseCurr, currCountiesCodeMapDetail, inputFieldLabel, placeHolder, size = "large", displayInput } = props;

    let currKeys;
    if (currCountiesCodeMapDetail != null) {
        currKeys = Object.keys(currCountiesCodeMapDetail);
    }

    const symbol = () => {
        for (let targetCurr of currKeys) {
            if (currCountiesCodeMapDetail[targetCurr].currCode === baseCurr) {
                return currCountiesCodeMapDetail[targetCurr].currSymbol;
            }
        }
    }

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
            InputProps={currCountiesCodeMapDetail != null && {
                startAdornment: <Box position="start" style={style.Box}>{symbol()}</Box>,
            }}
            // helperText="Input valid number."
            onChange={handleChange}
            value={displayInput}
        />
    )
};

const sxStyle = { TextField: { width: '25ch' } };
const style = { Box: { marginRight: "10px" } };