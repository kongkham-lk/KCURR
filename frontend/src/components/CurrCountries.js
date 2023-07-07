import { FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function CurrCountries({ label, updateVal, stateInputField, baseCurrVal, currApiArr, sxStyle}) {
    function handleChange(e) {
        updateVal({ name: stateInputField, value: e.target.value });
    }

    return (
        <FormControl sx={sxStyle}>
            <InputLabel id={stateInputField} >{label}</InputLabel>
            <Select
                labelId={stateInputField}
                id={stateInputField}
                value={baseCurrVal}
                label={label}
                onChange={handleChange}
                style={style.select}
            >
                {currApiArr?.map((curr) => (
                    <MenuItem key={curr.type} value={curr.type} >
                        <div style={style.div}>
                            <img
                                style={style.image}
                                src={`https://www.countryflagicons.com/SHINY/32/${curr.type.substring(0, 2)}.png`}
                                alt="" />
                            <span style={style.span}>{curr.display}</span>
                        </div>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

const style = {
    select: {height: "56.5px"},
    div: { display: "flex", alignItems: "center", padding: "0" },
    image: { margin: "0 10px 0px 0px" },
    span: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "1.5px" },
}