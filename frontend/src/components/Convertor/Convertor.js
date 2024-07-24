import '../../App.css';
import { useEffect, useState } from 'react';
import ConvertorForm from "./ConvertorForm";
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import RateHistoryGraph from '../subComponents/RateChangeGraphFeature';
import { retrieveConvertValue } from '../../util/apiClient';

export default function Convertor(props) {
    const { isDisplaySM, currentUrl } = props;
    //console.log("log sortedCurrsCodeList in convertor: ", sortedCurrsCodeList)
    // const { curr } = useParams();
    const [formData, setFormData] = useState(null);
    const [isNewUpdateRequest, setIsNewUpdateRequest] = useState(true);
    const [isSwapCurr, setIsSwapCurr] = useState(false);

    const isFeatureDisplay = currentUrl.pathname.toLowerCase().includes("convert");
    const [targetConvertCurrPair, setTargetConvertCurrPair] = useState(["USD", "THB"]);

    // useEffect(() => {
    //     async function updatePreference() {
    //         console.log("Update New conversion pair!!!");
    //         // if (isNewPrefUpdate ) {
    //         //     await updatePreference(userId, userPreference);
    //         //     setIsNewPrefUpdate(false);
    //         // }
    //     }
    //     updatePreference();
    // }, [targetConvertCurrPair])

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

    const handleTargetConvertCurrUpdate = (e) => {
        const newConvertCurrPair = [...targetConvertCurrPair];
        newConvertCurrPair[e.isBaseCurrency] = e.value;
        setTargetConvertCurrPair(newConvertCurrPair);
    }

    const handleConvertCurrSwap = (e) => {
        const newCurrPair = [targetConvertCurrPair[1], targetConvertCurrPair[0]];
        setTargetConvertCurrPair(newCurrPair);
        setIsSwapCurr(true);
    }

    const handleConversionFormDataUpdate = async (targetConvertAmount) => {
        if (!isSwapCurr) {
            setIsNewUpdateRequest(true);
            const response = await retrieveConvertValue(targetConvertAmount, targetConvertCurrPair);
            setFormData(() => {
                return {
                    amount: targetConvertAmount,
                    baseCurr: targetConvertCurrPair[0],
                    targetCurr: targetConvertCurrPair[1],
                    total: response.data
                }
            });
        } else
            setIsSwapCurr(false);
    };

    const attr = {
        convertorForm: {
            onConversionFormDataSubmit: handleConversionFormDataUpdate,
            targetConvertCurrPair,
            onTargetConvertCurrUpdate: handleTargetConvertCurrUpdate,
            onConvertCurrSwap: handleConvertCurrSwap,
            ...props
        },
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
            <ConvertorForm {...attr.convertorForm} />
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