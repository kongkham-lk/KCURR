import React from 'react';
import { useState } from 'react';
import ConvertorForm from "./ConvertorForm";
import Typography from '@mui/material/Typography';

export default function Convertor({ currApiKeyValuePair }) {
    const [formData, setFormData] = useState(null);

    function getFormData(inputData, response) {
        setFormData(() => {
            return {
                ...inputData, total: response.data
            }
        });
    }

    return (
        <>
            <ConvertorForm getFormData={getFormData} className="CovertForm" currApiKeyValuePair={currApiKeyValuePair} />
            {formData !== null && (
                <>
                    <Typography variant="h6" mt={3} color="grey" fontStyle="italic" fontWeight={400}>
                        1 {formData.baseCurr} = {(formData.total / formData.amount).toFixed(2)} {formData.targetCurr}
                    </Typography>
                    <Typography variant="h4" >
                        {formData.amount} {formData.baseCurr} = {formData.total.toFixed(2)} {formData.targetCurr}
                    </Typography>
                </>
            )}
        </>
    )
}