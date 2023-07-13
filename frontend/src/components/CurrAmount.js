import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export default function CurrAmount({ updateVal, error, baseCurr, currApiKeyValuePair }) {
    const handleChange = (e) => { updateVal(e.target) };
    
const currKeys = Object.keys(currApiKeyValuePair);

    const symbol = currKeys.map(currKey => {
        if (currApiKeyValuePair[currKey].currCode === baseCurr) {
            return currApiKeyValuePair[currKey].symbol;
        }
    })

    const isError = (<TextField
        required
        error
        label="Amount"
        name="amount"
        sx={sxStyle.TextField}
        InputProps={{
            startAdornment: <InputAdornment position="start">{symbol}</InputAdornment>,
        }}
        helperText="Please input valid number."
        onChange={handleChange}
    />);

    const nonError = (<TextField
        required
        label="Amount"
        id="amount"
        name="amount"
        placeholder="Enter number"
        sx={sxStyle.TextField}
        InputProps={{
            startAdornment: <InputAdornment position="start">{symbol}</InputAdornment>,
        }}
        onChange={handleChange}
    />);

    return (
        <>
            {error ? isError : nonError}
        </>
    )
};

const sxStyle = {TextField:{ width: '25ch' }};