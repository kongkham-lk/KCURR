import { FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function ExchangeRateChartTimeSeriesDropDown(props) {
    const { updateVal } = props;

    const timeSeriesRanges = ["Week", "Month", "Year"];

    const handleChange = (e) => updateVal({ timeSeriesRange: e.target.value });

    return (
        <FormControl sx={sxStyle.FormControl} size="small" >
            <InputLabel id="rateHistoricalChart" >Range</InputLabel>
            <Select
                labelId="rateHistoricalChart"
                id="rateHistoricalChart"
                value="Week"
                label="Range"
                onChange={handleChange}
                style={{ height: "40px", width:"150px" }}
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