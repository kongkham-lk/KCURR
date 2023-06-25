import React from 'react';
import { useState } from 'react';

// const currOption = [
//     { type: "", display: "Choose Currency" },
//     { type: "USD", display: "USD - US Dollar" },
//     { type: "EUR", display: "EUR - Euro" },
//     { type: "CAD", display: "CAD - Canadian Dollar" },
//     { type: "AUD", display: "AUD - Australia Dollar" },
//     { type: "THB", display: "THB - Thai Baht" },
//   ];
const currOption = [
    { type: "", display: "Choose Currency" },
    { type: { type: "USD", rate: 1 }, display: "USD - US Dollar" },
    { type: { type: "EUR", rate: 0.91 }, display: "EUR - Euro" },
    { type: { type: "CAD", rate: 1.32 }, display: "CAD - Canadian Dollar" },
    { type: { type: "AUD", rate: 1.5 }, display: "AUD - Australia Dollar" },
    { type: { type: "THB", rate: 35.32 }, display: "THB - Thai Baht" },
];

function CurrType({ type, getType, defaultType }) {
    const [country, setCountry] = useState(defaultType);
    function handleChange(e) {
        const currType = { name: type, value: country };
        console.log("currType: ", currType.value);
        getType(currType);
        setCountry(e.target.value)
    }
    return (
        <>
            <label htmlFor={type} >{type}</label>
            <select name={type} id={type} onChange={handleChange} >
                {currOption.map((curr) => (
                    <option value={curr.type} selected={curr.display.includes(country.type)} >{curr.display}</option>
                ))}
            </select>
        </>
    )
}

export default CurrType;
