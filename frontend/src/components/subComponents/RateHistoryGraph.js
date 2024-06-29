import '../../App.css';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { LineGraph } from './LineGraph';
import { retrieveExchangeRatesTimeSeries } from '../../util/apiClient';
import RangeTimeSeriesSelector from './RangeTimeSeriesSelector';
import { Box } from '@mui/material';

export default function RateHistoryGraph(props) {
    const { formData, passInRequestState, isDisplaySM, displayFeature } = props;
    
    const [timeSeries, setTimeSeries] = useState(null);
    const [timeSeriesRange, setTimeSeriesRange] = useState("1d");
    const [isNewUpdateRequest, setIsNewUpdateRequest] = useState(passInRequestState);

    let baseCurr;
    let targetCurr;
    let amount;
    let total;
    let changeRateInPercent;

    if (formData !== null) {
        baseCurr = formData.baseCurr;
        targetCurr = formData.targetCurr;
        amount = formData.amount;
        total = formData.total;
    }

    if (timeSeries !== null) {
        const changingRates = timeSeries.changingRates;
        changeRateInPercent = (changingRates[changingRates.length - 1] - changingRates[0]) / changingRates[0] * 100;
    }


    useEffect(() => {
        if (formData != null) {
            async function timeSeriesGetter() {
                const timeSeriesRes = await retrieveExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange, isNewUpdateRequest);
                setTimeSeries(timeSeriesRes.data[targetCurr])
            }
            timeSeriesGetter()
        }
    }, [formData, timeSeriesRange])

    const handleClick = (range) => {
        setIsNewUpdateRequest(false)
        setTimeSeriesRange(range)
    }

    return (
        <>
            {formData !== null && (
                <>
                    <Typography variant={isDisplaySM ? "h5" : "h4"} mt={3} mb={isDisplaySM ? 1 : 2} sx={{ fontSize: isDisplaySM ? "1.7rem" : "2.125rem" }}>
                        {amount} {baseCurr} = {total.toFixed(2)} {targetCurr}
                    </Typography>
                    {timeSeries !== null ?
                         <div style={{ borderTop: "1px solid #adadad60" }}>
                            <Typography variant={isDisplaySM ? "h6" : "h5"} mt={isDisplaySM ? 1 : 2.5} fontWeight={400} >
                                {baseCurr} to {targetCurr} Chart <span style={styleSpan(changeRateInPercent)}>{changeRateInPercent >= 0 && "+"}{changeRateInPercent.toFixed(2)}%</span>
                            </Typography>
                            <Typography variant="subtitle1" color="#727272f2" fontStyle="italic" fontWeight={500} mb={1} >
                                1 {baseCurr} = {(total / amount).toFixed(2)} {targetCurr}
                            </Typography>
                            {displayFeature &&
                                <div style={style.divChart} >
                                    <Box sx={{ ...sxStyle.lineGraph, height: !isDisplaySM && "300px" }}>
                                        <LineGraph timeSeries={timeSeries} displayLabel={true} />
                                    </Box>
                                    <div style={{ ...style.divRangeTimeSeriesSelector, marginTop: isDisplaySM ? "4%" : "2.5%", display: !displayFeature && "none" }}>
                                        <RangeTimeSeriesSelector updateVal={handleClick} isDisplaySM={isDisplaySM} />
                                    </div>
                                </div>
                            }
                        </div> : <div className="loader"></div>
                    }
                </>
            )}
        </>
    );
}

const styleSpan = (changeRateInPercent) => {
    return { color: changeRateInPercent >= 0 ? "green" : "#cd0000" }
}

const style = {
    divRangeTimeSeriesSelector: { textAlign: "center" },
    divChart: { height: "auto", width: "100%" },
}

const sxStyle = {
    lineGraph: { width: "-webkit-fill-available" }
}