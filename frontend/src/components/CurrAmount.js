import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

function CurrAmount({ updateVal, amount, error }) {
    const handleChange = (e) => {
        updateVal(e.target);
    };

    const isError = (<TextField
        required
        error
        label="Amount"
        name="amount"
        sx={{ width: '24ch' }}
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
        sx={{ width: '24ch' }}
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

export default CurrAmount;