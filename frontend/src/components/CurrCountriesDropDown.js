import { FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { getFlag } from '../util/getFlag';

export default function CurrCountriesDropDown(props) {
    const { label, onAddCurrCountry, inputCurrType, baseCurrVal = "", currCountiesCodeMapDetail, sxStyle, size, passInStyle = { height: "56.5px" } } = props;

    const unsortedKeys = Object.keys(currCountiesCodeMapDetail);
    const targetCurrs = unsortedKeys.sort();

    const handleChange = (e) => onAddCurrCountry({ name: inputCurrType, value: e.target.value });

    return (
        <FormControl sx={sxStyle} size={size}>
            <InputLabel id={inputCurrType} >{label}</InputLabel>
            <Select
                labelId={inputCurrType}
                id={inputCurrType}
                value={baseCurrVal}
                label={label}
                onChange={handleChange}
                style={passInStyle}
            >
                {console.log("Getflag of dropdown!!!")}
                {targetCurrs?.map((targetCurr) => (
                    <MenuItem key={currCountiesCodeMapDetail[targetCurr].currCode} value={currCountiesCodeMapDetail[targetCurr].currCode} >
                        <div style={style.div}>
                            {getFlag(currCountiesCodeMapDetail[targetCurr].currCode)}
                            <span style={style.span}>{currCountiesCodeMapDetail[targetCurr].display}</span>
                        </div>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

const style = {
    div: { display: "flex", alignItems: "center", padding: "0" },
    divGetFlag: {
        backgroundColor: "#dddbdb", border: "1px solid #b7b6b6", margin: "3.5px 10px 3.5px 0px",
        borderRadius: "1px", fontSize: "0.75rem", height: "22.5px", padding: "2px 3px",
        width: "31.5px", textAlign: "center",
    },
    span: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "1.5px" },
}