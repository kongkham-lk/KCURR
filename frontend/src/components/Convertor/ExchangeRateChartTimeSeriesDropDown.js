import { useState } from 'react';
import { FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function ExchangeRateChartTimeSeriesDropDown(props) {
    const { updateVal } = props;
    const [displayValue, setDisplayValue] = useState("Week")
    const timeSeriesRanges = ["Week", "Month", "Quater", "Half Year"];

    const handleChange = (e) => {
        updateVal(e.target.value);
        setDisplayValue(e.target.value);
    };

    return (
        <FormControl sx={sxStyle.FormControl} size="small" >
            <InputLabel id="rateHistoricalChart" >Range</InputLabel>
            <Select
                labelId="rateHistoricalChart"
                id="rateHistoricalChart"
                value={displayValue}
                label="Range"
                onChange={handleChange}
                style={style.Select}
            >
                {timeSeriesRanges?.map((range) => (
                    <MenuItem key={range} value={range} >
                        {range}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

const sxStyle = {
    FormControl: { mt: 3, minWidth: 1 / 4, width: 250 },
}

const style = {
    Select: { height: "40px", width: "150px" },
}