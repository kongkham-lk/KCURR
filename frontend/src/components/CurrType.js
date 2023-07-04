import { FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

function CurrType({ label, updateVal, type, defaultVal, currOption, styling}) {

    function handleChange(e) {
        updateVal({ name: type, value: e.target.value });
    }

    return (
        <FormControl sx={styling}>
            <InputLabel id={type} >{label}</InputLabel>
            <Select
                labelId={type}
                id={type}
                value={defaultVal}
                label={label}
                onChange={handleChange}
                style={{height: "56.5px"}}
            >
                {currOption?.map((curr) => (
                    <MenuItem key={curr.type} value={curr.type} >
                        <div style={{ display: "flex", alignItems: "center", padding: "0" }}>
                            <img
                                style={{ margin: "0 10px 0px 0px" }}
                                src={`https://www.countryflagicons.com/SHINY/32/${curr.type.substring(0, 2)}.png`}
                                alt="" />
                            <span style={{
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "1.5px"
                            }}>{curr.display}</span>
                        </div>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default CurrType;