import '../../App.css';
import { useEffect, useState } from 'react';
import ConvertorForm from "./ConvertorForm";
import Typography from '@mui/material/Typography';
import RateHistoryGraph from '../subComponents/RateChangeGraphFeature';
import { retrieveConvertValue } from '../../util/apiClient';
import { savePrefCovertedPair } from '../../util/userController';

export default function Convertor(props) {
    const { isDisplaySM, currentUrl, userId, userPreference, onPreferenceCookieUpdate } = props;
    const [formData, setFormData] = useState(null);
    const [isNewUpdateRequest, setIsNewUpdateRequest] = useState(true);

    const isFeatureDisplay = currentUrl.pathname.toLowerCase().includes("convert");
    const [targetConvertCurrPair, setTargetConvertCurrPair] = useState([]);
    const [isCurrPairUpdate, setCurrPairUpdate] = useState(false);

    let baseCurr = "", targetCurr = "", amount = 0.0, total = 0.0; // declare default variable to insert into the markup content

    useEffect(() => {
        console.log("setTargetConvertCurrPair!!!")
        setTargetConvertCurrPair([...userPreference.convertedCurrPair])
    }, [userPreference])

    // Display conversion result
    if (formData !== null) {
        baseCurr = formData.baseCurr;
        targetCurr = formData.targetCurr;
        amount = isNaN(formData.amount) ? 1 : formData.amount;
        total = formData.total;
    };

    // Invoke when new currency code is set through the dropdown menu
    const handleTargetConvertCurrUpdate = (e) => {
        const newConvertCurrPair = [...targetConvertCurrPair];
        newConvertCurrPair[e.isBaseCurrency] = e.value;
        handleCurrPairCookieUpdate(newConvertCurrPair);
    }

    // Invoke when swap currency code
    const handleConvertCurrSwap = (e) => {
        const newCurrPair = [targetConvertCurrPair[1], targetConvertCurrPair[0]];
        handleCurrPairCookieUpdate(newCurrPair);
    }

    const handleCurrPairCookieUpdate = (newCurrPair) => {
        setTargetConvertCurrPair(newCurrPair);
        // const newPreference = { ...userPreference };
        // newPreference.convertedCurrPair = newCurrPair;
        console.log("Save new conversion curr pair!!!");
        // onPreferenceCookieUpdate(newPreference);
        savePrefCovertedPair(userId, newCurrPair);
    }

    // Invode when click convert button on the screen
    const handleConversionFormDataUpdate = async (targetConvertAmount) => {
        if (targetConvertAmount !== 0 || isNaN(targetConvertAmount)) {
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
        }
    };

    const attr = {
        convertorForm: {
            onConversionFormDataSubmit: handleConversionFormDataUpdate,
            targetConvertCurrPair,
            onNewCurrCodeAssigned: handleTargetConvertCurrUpdate,
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