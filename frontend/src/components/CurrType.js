import React from 'react';
import { useState } from 'react';

function CurrType({ label = "from", getCurrType, currOption }) {
    // const [country, setCountry] = useState("");
    function handleChange(e) {
        console.log(`${label} - ${e.target.value}`)
        // setCountry(e.target.value)
        getCurrType({ method: label, type: e.target.value })
    }
    return (
        <>
            <label className="convertorLabel" htmlFor={label} >{label}</label>
            <select name={label} id={label} onChange={handleChange} >
                {/* <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australia Dollar</option>
                <option value="THB">THB - Thai Baht</option>
            </select> */}

            {/* <label htmlFor="from" >From</label> */}
            {/* <select name="from" id="from" onChange={handleChange} > */}
                {currOption.map((curr) => (
                    <option value={curr.type}>{curr.display}</option>
                ))}
            </select>
        </>
    )
}

export default CurrType;
