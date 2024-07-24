import '../../App.css';
import { useEffect, useState } from 'react';
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
    const [targetCurrencies, setTargetCurrencies] = useState(["USD", "THB"]);

    // useEffect(() => {
    //     async function updatePreference() {
    //         console.log("Update New conversion pair!!!");
    //         // if (isNewPrefUpdate ) {
    //         //     await updatePreference(userId, userPreference);
    //         //     setIsNewPrefUpdate(false);
    //         // }
    //     }
    //     updatePreference();
    // }, [targetCurrencies])

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
        console.log("e.isBaseCurrency: ", e.isBaseCurrency)
        // const targetCurrBase = e.isBaseCurrency === 0 ? "baseCurr" : "targetCurr";
        // setTargetCurrencies((oldFormInputs) => {
        //     return {
        //         ...oldFormInputs,
        //         [targetCurrBase]: e.value,
        //     };
        // });
        const newConvertCurrPair = [...targetCurrencies];
        newConvertCurrPair[e.isBaseCurrency] = e.value;
        setTargetCurrencies(newConvertCurrPair);
    }

    const setFormDataToConvertor = (inputData, response) => {
        setIsNewUpdateRequest(true);
        setFormData(() => {
            return {
                ...inputData, total: response.data
            }
        });
    };

    const attr = {
        convertorForm: {
            setFormDataToConvertor,
            targetCurrencies,
            onTargetConvertCurrUpdate: handleTargetConvertCurrUpdate,
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