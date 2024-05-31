import { useState } from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from '@mui/material/ToggleButtonGroup';

export default function RangeTimeSeriesSelector(props) {
  const { updateVal } = props;
  const [displayValue, setDisplayValue] = useState("1D")
  const timeSeriesRanges = ["1D", "1W", "1M", "3M", "6M", "1Y"];

  const handleChange = (event, newDisplayValue) => {
    updateVal(newDisplayValue);
    setDisplayValue(newDisplayValue);
  };

  return (
    // <ToggleButtonGroup
    //   size="small"
    //   color="primary"
    //   value={displayValue}
    //   exclusive
    //   onChange={handleChange}
    // >
      // {timeSeriesRanges?.map((range) => (
      //   <ToggleButton key={range} value={range} sx={sxStyle.ToggleButton}>{range}</ToggleButton>
      // ))}
    // </ToggleButtonGroup>
    <div>
        <StyledToggleButtonGroup
          size="small"
          value={displayValue}
          exclusive
          onChange={handleChange}
          aria-label="time series"
          color="primary"
        >
          {timeSeriesRanges?.map((range) => (
            <ToggleButton key={range} value={range} aria-label={range}>{range}</ToggleButton>
          ))}
        </StyledToggleButtonGroup>
    </div>
  );
};

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(1),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: '1px solid transparent',
    },
}));