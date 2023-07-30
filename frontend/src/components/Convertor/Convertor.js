import '../../App.css';
import { useState, useEffect } from 'react';
import ConvertorForm from "./ConvertorForm";
import Typography from '@mui/material/Typography';
import { LineGraph } from '../LineGraph';
import { retrieveExchangeRatesTimeSeries } from '../../util/apiClient';
import ExchangeRateChartTimeSeriesDropDown from './ExchangeRateChartTimeSeriesDropDown';


export default function Convertor(props) {
    const { currCountiesCodeMapDetail } = props;

    const [formData, setFormData] = useState(null);
    const [timeSeries, setTimeSeries] = useState(null);
    const [timeSeriesRange, setTimeSeriesRange] = useState("Week")

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
                console.log("## getting timeSeries => ")
                const timeSeriesRes = await retrieveExchangeRatesTimeSeries(baseCurr, targetCurr, timeSeriesRange);
                setTimeSeries(timeSeriesRes.data[targetCurr])
            }
            timeSeriesGetter()
        }
    }, [formData, timeSeriesRange]
    )

    const setFormDataToConvertor = (inputData, response) => {
        setFormData(() => {
            return {
                ...inputData, total: response.data
            }
        });
    }

    const handleClick = (range) => {
        setTimeSeriesRange(range)
    }

    return (
        <>
            <ConvertorForm setFormDataToConvertor={setFormDataToConvertor} currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
            {formData !== null && (
                <>
                    <Typography variant="h6" mt={3} color="grey" fontStyle="italic" fontWeight={400} >
                        1 {baseCurr} = {(total / amount).toFixed(2)} {targetCurr}
                    </Typography>
                    <Typography variant="h4" >
                        {amount} {baseCurr} = {total.toFixed(2)} {targetCurr}
                    </Typography>
                    {timeSeries !== null
                        ? <>
                            <Typography variant="h5" mt={3} mb={1} fontWeight={400} >
                                {baseCurr} to {targetCurr} Chart <span style={styleSpan(changeRateInPercent)}>{changeRateInPercent >= 0 && "+"}{changeRateInPercent.toFixed(2)}%</span> (1w)
                            </Typography>
                            <LineGraph timeSeries={timeSeries} displayLabel={true} />
                            <ExchangeRateChartTimeSeriesDropDown updateVal={handleClick} />
                        </> : <div className="loader"></div>
                    }
                </>
            )}
        </>
    )
}

const styleSpan = (changeRateInPercent) => {
    return { color: changeRateInPercent >= 0 ? "green" : "#cd0000" }
}