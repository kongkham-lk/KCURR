import '../../App.css';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { LineGraph } from './LineGraph';
import { retrieveExchangeRatesTimeSeries } from '../../util/apiClient';
import RangeTimeSeriesSelector from './RangeTimeSeriesSelector';
import { Box } from '@mui/material';

export default function RateChangeGraphFeature(props) {
    const { currencyRateData, passInRequestState, isDisplaySM, isFeatureDisplay, removeMarginTop = false } = props;

    const [timeSeries, setTimeSeries] = useState(null);
    const [timeSeriesRange, setTimeSeriesRange] = useState("1d");
    const [isNewUpdateRequest, setIsNewUpdateRequest] = useState(passInRequestState);

    let baseCurr;
    let targetCurr;
    let changeRateInPercent;
    let latestRate;

    if (currencyRateData !== null) {
        baseCurr = currencyRateData.baseCurr;
        targetCurr = currencyRateData.targetCurr;
        latestRate = (currencyRateData.total / currencyRateData.amount).toFixed(2);
    }

    if (timeSeries !== null) {
        const changingRates = timeSeries.changingRates;
        changeRateInPercent = (changingRates[changingRates.length - 1] - changingRates[0]) / changingRates[0] * 100;
    }

    useEffect(() => {
        if (currencyRateData != null && isFeatureDisplay) {
            async function timeSeriesGetter() {
                const timeSeriesRes = await retrieveExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange, isNewUpdateRequest);
                setTimeSeries(timeSeriesRes.data[targetCurr]);
            }
            timeSeriesGetter()
        }
    }, [currencyRateData, timeSeriesRange])

    const handleClick = (range) => {
        setIsNewUpdateRequest(false)
        setTimeSeriesRange(range)
    }

    return (
        <>
            <div style={removeMarginTop ? style.TopBorderNone : style.TopBorderAdded}>
                {timeSeries !== null &&
                    <Typography variant={isDisplaySM ? "h6" : "h5"} mt={!removeMarginTop ? isDisplaySM ? 1 : 2.5 : 0} fontWeight={400} >
                        {baseCurr} to {targetCurr} Chart <span style={styleSpan(changeRateInPercent)}>{changeRateInPercent >= 0 && "+"}{changeRateInPercent.toFixed(2)}%</span>
                    </Typography>
                }
                {latestRate !== "NaN" ?
                    <Typography variant="subtitle1" color="#727272f2" fontStyle="italic" fontWeight={500} mb={1} mt={timeSeries === null && 1} >
                        1 {baseCurr} = {latestRate} {targetCurr}
                    </Typography> : <br />
                }
                {isFeatureDisplay &&
                    <div style={style.divChart} >
                        <Box sx={isDisplaySM ? sxStyle.lineGraphSm : sxStyle.lineGraphLg}>
                            <LineGraph timeSeries={timeSeries} displayLabel={true} />
                        </Box>
                        <div style={isFeatureDisplay ? isDisplaySM ? style.divRangeSelectorWrapperSm : style.divRangeSelectorWrapperLg : style.divRangeSelectorNone}>
                            <RangeTimeSeriesSelector updateVal={handleClick} isDisplaySM={isDisplaySM} />
                        </div>
                    </div>
                }
            </div>
        </>
    );
}

const styleSpan = (changeRateInPercent) => {
    return { color: changeRateInPercent >= 0 ? "green" : "#cd0000" }
}

const commonStyle = {
    width: {width: "-webkit-fill-available"},
    textAlign: {textAlign: "center"}
}

const style = {
    divRangeSelectorWrapperSm: { ...commonStyle.textAlign, margin: "4% 0px" },
    divRangeSelectorWrapperLg: { ...commonStyle.textAlign, margin: "20px 0px 2% 0px" },
    divRangeSelectorNone: { display: "none" },
    divChart: { height: "auto", width: "100%" },
    TopBorderAdded: { borderTop: "1px solid #adadad60" },
    TopBorderNone: { borderTop: "0px" },
}

const sxStyle = {
    lineGraphSm: { ...commonStyle.width },
    lineGraphLg: { ...commonStyle.width, height: "300px" },
}