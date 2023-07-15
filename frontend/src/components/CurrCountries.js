import { FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function CurrCountries({ label, updateVal, stateInputField, baseCurrVal, currApiKeyValuePair, sxStyle, size, passInStyle = { height: "56.5px" } }) {
    function handleChange(e) {
        updateVal({ name: stateInputField, value: e.target.value });
    }

    const unsortedKeys = Object.keys(currApiKeyValuePair);

    const currKeys = unsortedKeys.sort();

    return (
        <FormControl sx={sxStyle} size={size}>
            <InputLabel id={stateInputField} >{label}</InputLabel>
            <Select
                labelId={stateInputField}
                id={stateInputField}
                value={baseCurrVal}
                label={label}
                onChange={handleChange}
                style={passInStyle}
            >
                {currKeys?.map((currKey) => (
                    <MenuItem key={currApiKeyValuePair[currKey].currCode} value={currApiKeyValuePair[currKey].currCode} >
                        <div style={style.div}>
                            {getFlag(currApiKeyValuePair[currKey].countryCode)}
                            <span style={style.span}>{currApiKeyValuePair[currKey].display}</span>
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
        borderRadius: "1px", fontSize: "0.75rem", height: "23px", padding: "2px 3px",
        width: "32px", textAlign: "center",
    },
    image: { margin: "0 10px 0px 0px" },
    span: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "1.5px" },
}

const getFlag = (currCountry) => {
    if (currCountry == null || currCountry.substring(0, 1) === "X") {
        return <div style={style.divGetFlag} >{currCountry}</div>
    } else {
        return <img style={style.image} src={getBaseUrl(currCountry)} alt="" />
    }
};

const getBaseUrl = (currCountry) => {
    return `https://www.countryflagicons.com/SHINY/32/${currCountry.substring(0, 2)}.png`;
}