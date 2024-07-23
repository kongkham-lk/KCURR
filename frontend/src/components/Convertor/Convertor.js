import '../../App.css';
import { useState } from 'react';
import ConvertorForm from "./ConvertorForm";
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import RateHistoryGraph from '../subComponents/RateChangeGraphFeature';

export default function Convertor(props) {
    const { isDisplaySM, currentUrl } = props;
    //console.log("log sortedCurrsCodeList in convertor: ", sortedCurrsCodeList)
    // const { curr } = useParams();
    const [formData, setFormData] = useState(null);
    const [isNewUpdateRequest, setIsNewUpdateRequest] = useState(true);

    const isFeatureDisplay = currentUrl.pathname.toLowerCase().includes("convert");
    const targetCurrencies = {
        baseCurr: "USD",
        targetCurr: "THB",
    };

    let baseCurr;
    let targetCurr;
    let amount;
    let total;

    if (formData !== null) {
        baseCurr = formData.baseCurr;
        targetCurr = formData.targetCurr;
        amount = formData.amount;
        total = formData.total;
    };

    const setFormDataToConvertor = (inputData, response) => {
        setIsNewUpdateRequest(true);
        setFormData(() => {
            return {
                ...inputData, total: response.data
            }
        });
    };
    
    const attr = {
        RateHistoryGraph: {
            currencyRateData: formData,
            passInRequestState: isNewUpdateRequest,
            isFeatureDisplay,
            ...props
        }
    };
    
    return (
        <>
            <Typography variant="h5" color="black" component="div" my={2} sx={{ marginBottom: isDisplaySM ? "16px" : "25px" }}>
                Convertor
            </Typography>
            <ConvertorForm setFormDataToConvertor={setFormDataToConvertor} targetCurrencies={targetCurrencies} {...props} /> 
            {formData !== null && (
                <>
                    <Typography variant={isDisplaySM ? "h5" : "h4"} mt={3} mb={isDisplaySM ? 1 : 2} sx={{ fontSize: isDisplaySM ? "1.7rem" : "2.125rem" }}>
                        {amount} {baseCurr} = {total.toFixed(2)} {targetCurr}
                    </Typography>
                    <RateHistoryGraph {...attr.RateHistoryGraph} />
                </>
            )}
        </>
    )
}