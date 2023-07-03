import { FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState, useEffect } from 'react';
import axios from 'axios';

function CurrType({ label, updateVal, type, defaultType }) {
    const [currOption, setCurrOption] = useState([]);

    useEffect(
        function fetchData() {
            async function fetchCurrOption() {
                try {
                    const responseCurrOption = await axios.get('http://localhost:8080/api/exchange-rate');
                    const currData = getCurrOpt(responseCurrOption.data.supported_codes);
                    setCurrOption([...currData]);
                } catch (e) {
                    console.log(e.stack);
                }
            }
            fetchCurrOption();
        }, []
    );

    function getCurrOpt(responseCurrOption) {
        const option = responseCurrOption.map(el => (
            { type: el[0], display: `${el[0]} - ${el[1]}` }
        ))
        return option;
    }

    function handleChange(e) {
        updateVal({ name: type, value: e.target.value });
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 200, width: 250 }} >
            <InputLabel id={type} >{label}</InputLabel>
            <Select
                labelId={type}
                id={type}
                value={defaultType}
                label={label}
                onChange={handleChange}
            >
                {currOption.map((curr) => (
                    <MenuItem key={curr.type} value={curr.type} >
                        <img 
                        style={{margin: "0 10px -10px 0px"}} 
                        src={`https://www.countryflagicons.com/FLAT/32/${curr.type.substring(0,2)}.png`} 
                        alt="flags" />  
                        <span >{curr.display}</span>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default CurrType;