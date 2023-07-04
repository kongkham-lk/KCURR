import React from 'react';
import { useState } from 'react';
import ConvertorForm from "./ConvertorForm";
import Typography from '@mui/material/Typography';

export default function Convertor({currOption}) {
    const [formData, setFormData] = useState(null);
    function getValue(inputData, response) {
        setFormData(() => {
            return {
                ...inputData, total: response.data
            }
        });
    }

    console.log("formData:\n", formData);
    return (
        <>
            <ConvertorForm getValue={getValue} className="CovertForm" currOption={currOption} />
            {formData !== null && (
                <>
                    <Typography variant="h6" mt={3} color="grey" fontStyle="italic" fontWeight={400}>
                        1 {formData.sourceCurr} = {(formData.total / formData.amount).toFixed(2)} {formData.targetCurr}
                    </Typography>
                    <Typography variant="h4" >
                        {formData.amount} {formData.sourceCurr} = {formData.total.toFixed(2)} {formData.targetCurr}
                    </Typography>
                </>
            )}
        </>
    )
}