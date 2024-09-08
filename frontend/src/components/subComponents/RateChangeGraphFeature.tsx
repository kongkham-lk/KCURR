import '../../App.css';
import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { LineGraph } from './LineGraph';
import { retrieveExchangeRatesTimeSeries } from '../../util/apiClient';
import RangeTimeSeriesSelector from './RangeTimeSeriesSelector';
import { Box } from '@mui/material';
import { type ConversionData, type CurrCodeMapTimeSerie, type DisplayFlags, type TimeSerie } from '../../lib/types';
import { getBaseColor, getTargetBaseColor } from '../../util/globalVariable';

type RateChangeGraphFeatureProps = Omit<DisplayFlags, "isDisplayMD"> & {
    passDownUpdateRequestFlag: boolean; // check if need to update chart. Only conversion need this property
    currencyRateData: ConversionData | null; // instead of checking for passDownUpdateRequestFlag to update chart, LiveRate look at the baseCurr instead
    removeMarginTop?: boolean
    isChartFeatureEnable? : boolean
}

export default function RateChangeGraphFeature(props: RateChangeGraphFeatureProps) {
    const { currencyRateData, passDownUpdateRequestFlag, isDisplaySM, removeMarginTop = false, isChartFeatureEnable = false } = props;
    const [timeSeries, setTimeSeries] = useState<TimeSerie | null>(null);
    const [timeSeriesRange, setTimeSeriesRange] = useState<string>("1d");
    const [isNewUpdateRequest, setIsNewUpdateRequest] = useState<boolean>(passDownUpdateRequestFlag);

    let baseCurr = "";
    let targetCurr = "";
    let changeRateInPercent = 0;
    let latestRate = "";

    if (currencyRateData !== null) {
        baseCurr = currencyRateData.baseCurr;
        targetCurr = currencyRateData.targetCurr;
        latestRate = (currencyRateData.total / currencyRateData.amount).toFixed(2);
    }

    if (timeSeries !== null) {
        const changingRates: number[] = timeSeries.changingRates;
        changeRateInPercent = (changingRates[changingRates.length - 1] - changingRates[0]) / changingRates[0] * 100;
    }

    useEffect(() => {
        async function timeSeriesGetter() {
            if (currencyRateData != null && isChartFeatureEnable) {
                console.log("retrieveExchangeRatesTimeSeries!!!")
                const timeSeriesRes: CurrCodeMapTimeSerie = await retrieveExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange, isNewUpdateRequest);
                setTimeSeries(timeSeriesRes[targetCurr]);
            }
        }
        timeSeriesGetter()
    }, [baseCurr, currencyRateData, isChartFeatureEnable, isNewUpdateRequest, targetCurr, timeSeriesRange])

    const handleClick = (range: string): void => {
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
                    <Typography variant="subtitle1" color="inherit" fontStyle="italic" fontWeight={500} mb={1} mt={timeSeries === null ? 1 : 0} >
                        1 {baseCurr} = {latestRate} {targetCurr}
                    </Typography> : <br />
                }
                {isChartFeatureEnable &&
                    <div style={style.divChart} >
                        <Box sx={isDisplaySM ? sxStyle.lineGraphSm : sxStyle.lineGraphLg}>
                            <LineGraph timeSeries={timeSeries} displayLabel={true} />
                        </Box>
                        <div style={isChartFeatureEnable ? isDisplaySM ? style.divRangeSelectorWrapperSm : style.divRangeSelectorWrapperLg : style.divRangeSelectorNone}>
                            <RangeTimeSeriesSelector updateVal={handleClick} isDisplaySM={isDisplaySM} />
                        </div>
                    </div>
                }
            </div>
        </>
    );
}

const styleSpan = (changeRateInPercent: number) => {
    return { color: changeRateInPercent >= 0 ? "green" : "#cd0000" }
}

const commonStyle = {
    Width: { width: "-webkit-fill-available" },
    TextAlign: { textAlign: "center" as const }
}

const style = {
    divRangeSelectorWrapperSm: { ...commonStyle.TextAlign, margin: "4% 0px" },
    divRangeSelectorWrapperLg: { ...commonStyle.TextAlign, margin: "20px 0px 2% 0px" },
    divRangeSelectorNone: { display: "none" },
    divChart: { height: "auto", width: "100%" },
    TopBorderAdded: { borderTop: "1px solid #adadad60" },
    TopBorderNone: { borderTop: "0px" },
}

const sxStyle = {
    lineGraphSm: { ...commonStyle.Width },
    lineGraphLg: { ...commonStyle.Width, height: "300px" },
}