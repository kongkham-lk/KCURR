import TextField from '@mui/material/TextField';

function CurrAmount({ updateVal, amount }) {
    const handleChange = (e) => {
        updateVal(e.target);
    };

    const input = amount.toString();

    return (
        <TextField
            required
            id="amount"
            label="Amount"
            variant="outlined"
            name="amount"
            placeholder={input}
            onChange={handleChange}
        />)
};

export default CurrAmount;

