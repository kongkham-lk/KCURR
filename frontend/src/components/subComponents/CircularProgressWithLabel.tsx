import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from 'react';
import { type DisplayFlags } from '../../lib/types';

function CircularProgressWithLabel(props: CircularProgressProps & { value: number },) {
    return (
        <Box sx={{ ...sxStyle.Container, justifyContent: displaySM ? 'flex-end' : undefined }}>
            <Box sx={sxStyle.Box}>
                <CircularProgress
                    variant="determinate"
                    sx={{ ...sxStyle.CircularGrey, ...sxStyle.CenterPos }}
                    size={40}
                    thickness={4}
                    {...props}
                    value={100}
                />
                <CircularProgress variant="determinate" {...props} />
                <Box
                    sx={sxStyle.CenterPos}
                >
                    <Typography variant="button" component="div" color="text.secondary">
                        {`${Math.round(props.value / 1.6667)}`}
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex', flexDirection: 'column', ml: 2, mr: displayMD && !displaySM ? '30px' : 'auto',
                    width: displaySM ? '50%' : '100%'
                }}
            >
                <Typography variant="body2" fontSize={displaySM ? '0.78rem' : 'auto'}>
                    {"Last Update "}
                </Typography>
                <Typography variant="body2" fontSize={displaySM ? '0.78rem' : 'auto'}>
                    {updateTime}
                </Typography>
            </Box>
        </Box>
    );
}

CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
};

type CircularWithValueLabelProps = DisplayFlags & {
    onUpdateNewLiveRate: () => void;
    onUpdateDisplayTime: () => void;
    lastUpdateRateTime: string;
}

export default function CircularWithValueLabel(props: CircularWithValueLabelProps) {
    const { onUpdateNewLiveRate, onUpdateDisplayTime, lastUpdateRateTime, isDisplaySM, isDisplayMD } = props;
    const [progress, setProgress] = useState(59);
    const [timerForUpdateNewLiveRate, setTimerForUpdateNewLiveRate] = useState(15); // reduce the frequency of retrieving new rate from run out of quota

    const checkTimer = (prevProgress: number) => {
        if (prevProgress <= 1) {  // 1.66 * 60 = 99.6
            // console.log('Reset timer and Refresh lives rate!!!');
            prevProgress = 99;
            const updateCounter = timerForUpdateNewLiveRate - 1;
            if (updateCounter === 0) {
                onUpdateNewLiveRate();
                setTimerForUpdateNewLiveRate(15);
            } else {
                setTimerForUpdateNewLiveRate(updateCounter);
            }
            onUpdateDisplayTime();
        } else {
            prevProgress -= 1.7;
        }
        return prevProgress;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => checkTimer(prevProgress));
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [progress, lastUpdateRateTime, timerForUpdateNewLiveRate, isDisplaySM, isDisplayMD]);

    useEffect(() => {
        setUpdateTime(lastUpdateRateTime);
    }, [lastUpdateRateTime]);

    useEffect(() => {
        CheckDisplaySM(isDisplaySM);
    }, [isDisplaySM]);

    useEffect(() => {
        CheckDisplayMD(isDisplayMD);
    }, [isDisplayMD]);

    return <CircularProgressWithLabel value={progress} thickness={3} size={45} />;
}

const sxStyle = {
    Container: { display: 'flex', alignItems: 'center' },
    Box: { position: 'relative', display: 'inline-flex' },
    CircularGrey: { color: (theme: any) => theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800], '& svg': { position: 'inherit' } },
    CenterPos: {
        top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center',
        justifyContent: 'center'
    }
}

var updateTime: string = "0";
var displaySM = false;
var displayMD = false;

const setUpdateTime = (time: string) => {
    updateTime = time;
}

const CheckDisplaySM = (val: boolean) => {
    displaySM = val;
}

const CheckDisplayMD = (val: boolean) => {
    displayMD = val;
}