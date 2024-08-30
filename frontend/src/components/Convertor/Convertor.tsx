import '../../App.css';
import React, { useEffect, useState } from 'react';
import ConvertorForm from './ConvertorForm';
import Typography from '@mui/material/Typography';
import RateChangeGraphFeature from '../subComponents/RateChangeGraphFeature';
import { retrieveConvertValue } from '../../util/apiClient';
import { savePrefCovertedPair } from '../../hook/userController';
import { type DisplayFlags, type NewCurrCodeAssigned, type ConversionData, type CurrCountriesApi, type Preference } from '../../lib/types';

type ConvertorProps = DisplayFlags & Omit<CurrCountriesApi, "isReady"> & {
    userPreference: Preference | null;
    userId: string;
};

export default function Convertor(props: ConvertorProps) {
    const { isDisplaySM, userId, userPreference } = props

    const [formData, setFormData] = useState<ConversionData | null>(null);
    const [isNewUpdateRequest, setIsNewUpdateRequest] = useState<boolean>(true);
    const [targetConvertCurrPair, setTargetConvertCurrPair] = useState<string[]>([]);

    let baseCurr: string = "";
    let targetCurr: string = "";
    let amount: number = 0.0;
    let total: number = 0.0; // declare default variable to insert into the markup content

    useEffect(() => {
        // console.log("Reassign initial convertPair to dropdown (when userPref not null)!!!")
        if (userPreference !== null)
            setTargetConvertCurrPair(Object.assign([], userPreference.convertedCurrPair)) // this equivalent to spread operator [...userPreference.convertedCurrPair]
    }, [userPreference])

    // Display conversion result
    if (formData !== null) {
        baseCurr = formData.baseCurr;
        targetCurr = formData.targetCurr;
        amount = isNaN(formData.amount) ? 1 : formData.amount;
        total = formData.total;
    };

    // Invoke when new currency code is set through the dropdown menu
    const handleTargetConvertCurrUpdate = (e: NewCurrCodeAssigned): void => {
        const newConvertCurrPair = [...targetConvertCurrPair];
        newConvertCurrPair[e.isBaseCurrency] = e.value;
        handleCurrPairCookieUpdate(newConvertCurrPair);
    }

    // Invoke when swap currency code
    const handleConvertCurrSwap = (): void => {
        const newCurrPair = [targetConvertCurrPair[1], targetConvertCurrPair[0]];
        handleCurrPairCookieUpdate(newCurrPair);
    }

    const handleCurrPairCookieUpdate = (newCurrPair: string[]) => {
        setTargetConvertCurrPair(newCurrPair);
        console.log("Save new conversion curr pair!!!");
        savePrefCovertedPair(userId, newCurrPair);
    }

    // Invode when click convert button on the screen
    const handleConversionFormDataUpdate = async (targetConvertAmount: number): Promise<void> => {
        if (targetConvertAmount !== 0 || isNaN(targetConvertAmount)) {
            setIsNewUpdateRequest(true);
            const totalConvertAmount = await retrieveConvertValue(targetConvertAmount, targetConvertCurrPair);
            setFormData(() => {
                return {
                    amount: targetConvertAmount,
                    baseCurr: targetConvertCurrPair[0],
                    targetCurr: targetConvertCurrPair[1],
                    total: totalConvertAmount
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
            passDownUpdateRequestFlag: isNewUpdateRequest,
            isDisplaySM,
        }
    };

    return (
        <>
            <Typography variant="h5" color="inherit" component="div" my={2} sx={{ marginBottom: isDisplaySM ? "16px" : "25px" }}>
                Convertor
            </Typography>
            <ConvertorForm {...attr.convertorForm} />
            {formData !== null && (
                <>
                    <Typography variant={isDisplaySM ? "h5" : "h4"} mt={3} mb={isDisplaySM ? 1 : 2} sx={{ fontSize: isDisplaySM ? "1.7rem" : "2.125rem" }}>
                        {amount} {baseCurr} = {total.toFixed(2)} {targetCurr}
                    </Typography>
                    <RateChangeGraphFeature {...attr.RateHistoryGraph} />
                </>
            )}
        </>
    )
}