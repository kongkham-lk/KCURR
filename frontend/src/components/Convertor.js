import React from 'react';
import { useState } from 'react';
import ConvertorForm from "./ConvertorForm";

export default function Convertor() {
    const [formData, setFormData] = useState(null);
    function getValue(inputData, total) {
        setFormData(() => {
            return {
                ...inputData, total: total
            }
        });
    }
    console.log("formData:\n", formData);
    return (
        <>
            <ConvertorForm getValue={getValue} />
            {formData !== null && (
                <>
                    <h6>1 {formData.from} = {formData.amount} {formData.to} </h6>
                    <h4>{formData.amount} {formData.from.type} = {formData.amount * formData.to.rate} {formData.to.type} </h4>
                </>
            )}
        </>
    )
}