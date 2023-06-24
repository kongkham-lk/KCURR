// import React from 'react';
import { useState } from 'react';
// import { v4 as uuid } from "uuid";


function Convertor() {
  const [inputs, setInputs] = useState({ amount: 1.00, from: 'USD', to: 'THB' });

  const currOption = [
    { type: "", display: "Choose Currency" },
    { type: "USD", display: "USD - US Dollar" },
    { type: "EUR", display: "EUR - Euro" },
    { type: "CAD", display: "CAD - Canadian Dollar" },
    { type: "AUD", display: "AUD - Australia Dollar" },
    { type: "THB", display: "THB - Thai Baht" },
  ];

  const handleSubmit = (event) => {
    // const form = event.currentTarget;
    // if (form.checkValidity() === false) {
    event.preventDefault();
    //   event.stopPropagation();
    // }

    // setValidated(true);
  };

  const handleChange = (e) => {
    console.log(e);
  };

  const handleSwap = () => {
    console.log("SWAP!!!");
    const { amount, from, to } = inputs;
    const newInput = { amount: amount, from: to, to: from };
    setInputs(newInput);
  }
  console.log(inputs);

  return (
    <form onSubmit={handleSubmit}>
          <label htmlFor="amount">Amount</label>
          <input id="amount" type="text" name="amount" />
          <label htmlFor="from" >From</label>
          <select name="from" id="from" onChange={handleChange} >
            {currOption.map((curr) => (
              <option value={curr.type} selected={curr.type === inputs.from}>{curr.display}</option>
            ))}
          </select>
          <button type="button" className="swap" onClick={handleSwap}>Swap</button>
          <label htmlFor="to" >To</label>
          <select name="to" id="to" onChange={handleChange} >
            {currOption.map((curr) => (
              <option value={curr.type} selected={curr.type === inputs.to}>{curr.display}</option>
            ))}
          </select>
      <button>Convert</button>
    </form>
  )
}

export default Convertor;