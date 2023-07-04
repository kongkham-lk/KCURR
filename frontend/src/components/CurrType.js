import { FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';

function CurrType({ label, updateVal, type, defaultType, currOption }) {

    function handleChange(e) {
        updateVal({ name: type, value: e.target.value });
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 200, width: 250 }} >
            <InputLabel id={type} >{label}</InputLabel>
            <Select
                labelId={type}
                id={type}
                value={defaultType}
                label={label}
                onChange={handleChange}
            >
                {currOption.map((curr) => (
                    <MenuItem key={curr.type} value={curr.type} >
                        <img
                            style={{ margin: "0 10px -10px 0px" }}
                            src={`https://www.countryflagicons.com/FLAT/32/${curr.type.substring(0, 2)}.png`}
                            alt="" />
                        <span >{curr.display}</span>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default CurrType;