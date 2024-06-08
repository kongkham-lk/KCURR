import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CircularProgressWithLabel(props) {
  const { lastUpdateRateTime, isDisplaySM, isDisplayMD } = props
  return (
    <Box sx={{...sxStyle.Container, justifyContent: isDisplaySM && 'flex-end'}}>
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

      <Box ml={2} sx={{display: 'flex', flexDirection: 'column', width: isDisplaySM ? '50%' : '100%', marginRight: isDisplayMD && '30px'}}>
        <Typography variant="body2" sx={{fontSize: isDisplaySM && '0.78rem'}}>
            {"Last Update "}
        </Typography>
        <Typography variant="body2" sx={{fontSize: isDisplaySM && '0.78rem'}}>
            {lastUpdateRateTime}
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

export default function CircularWithValueLabel(props) {
  const [progress, setProgress] = useState(60);
  const { onUpdateNewLiveRate, lastUpdateRateTime, isDisplaySM, isDisplayMD } = props;

  const checkTimer = (prevProgress) => {
    if (prevProgress <= 0) {
      // console.log('Reset timer and Refresh lives rate!!!');
      onUpdateNewLiveRate();
      prevProgress = 100;
    } else {
      prevProgress -= 1.667;
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
  }, [progress, lastUpdateRateTime, isDisplaySM, isDisplayMD]);

  return <CircularProgressWithLabel value={progress} thickness={3} size={45} lastUpdateRateTime={lastUpdateRateTime} isDisplaySM={isDisplaySM} isDisplayMD={isDisplayMD} />;
}

const sxStyle = {
  Container: { display: 'flex', alignItems: 'center' },
  Box: { position: 'relative', display: 'inline-flex' },
  CircularGrey: { color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800] },
  CenterPos: { top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', 
                justifyContent: 'center' }
}