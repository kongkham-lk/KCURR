import { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function RangeTimeSeriesSelector(props) {
  const { updateVal } = props;
  const [displayValue, setDisplayValue] = useState("Week")
  const timeSeriesRanges = ["Week", "Month", "Quater", "Half Year"];

  const handleChange = (event, newDisplayValue) => {
    updateVal(newDisplayValue);
    setDisplayValue(newDisplayValue);
  };

  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      value={displayValue}
      exclusive
      onChange={handleChange}
    >
      {timeSeriesRanges?.map((range) => (
        <ToggleButton key={range} value={range} sx={sxStyle.ToggleButton}>{range}</ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

const sxStyle = {
  ToggleButton: {px: 2},
}