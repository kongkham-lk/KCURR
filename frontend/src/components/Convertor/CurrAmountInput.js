import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function CurrAmountInput(props) {
    const { updateVal, isError, baseCurr, currCountiesCodeMapDetail } = props;

    const currKeys = Object.keys(currCountiesCodeMapDetail);
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
            label="Amount"
            id="amount"
            name="amount"
            placeholder="Enter number"
            sx={sxStyle.TextField}
            InputProps={{
                startAdornment: <Box position="start" style={style.Box}>{symbol()}</Box>,
            }}
            helperText="Please input valid number."
            onChange={handleChange}
        />
    )
};

const sxStyle = { TextField: { width: '25ch' } };
const style = { Box: { marginRight: "10px" } }