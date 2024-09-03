import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses, } from '@mui/material/ToggleButtonGroup';
import { type DisplayFlags } from '../../lib/types';

type RangeTimeSeriesSelectorProps = Omit<DisplayFlags, 'isDisplayMD'> & {
    updateVal: (range: string) => void;
}

export default function RangeTimeSeriesSelector(props: RangeTimeSeriesSelectorProps) {
    const { updateVal, isDisplaySM } = props;
    const [displayValue, setDisplayValue] = useState("1d")
    const timeSeriesRanges = ["1d", "1w", "1m", "3m", "6m", "9m", "1y"];

    const handleChange = (event: React.MouseEvent<HTMLElement>, newDisplayValue: string) => {
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
                size={isDisplaySM ? "small" : "large"}
                value={displayValue}
                exclusive
                onChange={handleChange}
                aria-label="time series"
                color="primary"
                style={isDisplaySM ? style.sm : style.lg}
            >
                {timeSeriesRanges?.map((range) => (
                    <ToggleButton key={range} value={range} aria-label={range}>{range.toUpperCase()}</ToggleButton>
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

const borderStyle = "1px solid #00000030";

const commonStyle = {
    borderTop: borderStyle,
    borderBottom: borderStyle,
}

const style = {
    sm: { ...commonStyle, width: '65%', overflow: 'scroll' },
    lg: { ...commonStyle },
}