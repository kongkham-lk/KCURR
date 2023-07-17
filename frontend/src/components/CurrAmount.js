import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export default function CurrAmount({ updateVal, error }) {
    const handleChange = (e) => { updateVal(e.target) };

    const isError = (<TextField
        required
        error
        label="Amount"
        name="amount"
        sx={sxStyle.TextField}
        InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
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