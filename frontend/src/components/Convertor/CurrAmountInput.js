import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export default function CurrAmountInput(props) {
    const { updateVal, isError, baseCurr, currCountiesCodeMapDetail } = props;

    const currKeys = Object.keys(currCountiesCodeMapDetail);
    const symbol = () => {
        for (let targetCurr of currKeys) {
            if (currCountiesCodeMapDetail[targetCurr].currCode === baseCurr) {
                return currCountiesCodeMapDetail[targetCurr].symbol;
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
                startAdornment: <InputAdornment position="start">{symbol}</InputAdornment>,
            }}
            helperText="Please input valid number."
            onChange={handleChange}
        />
    )
};

const sxStyle = { TextField: { width: '25ch' } };