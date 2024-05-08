import { useState } from 'react';
import ConvertorForm from "./ConvertorForm";
import Typography from '@mui/material/Typography';

export default function Convertor(props) {
    const { currCountiesCodeMapDetail } = props;

    const [formData, setFormData] = useState(null);

    const setFormDataToConvertor = (inputData, response) => {
        setFormData(() => {
            return {
                ...inputData, total: response.data
            }
        });
    }

    return (
        <>
            <ConvertorForm setFormDataToConvertor={setFormDataToConvertor} currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
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