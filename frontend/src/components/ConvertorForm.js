import { useState } from 'react';
// import { useState, useEffect } from 'react';
import axios from 'axios';
// import CurrType from './CurrType'

function Convertor({ getValue }) {
  const [inputs, setInputs] = useState({ amount: 0, from: 'USD', to: 'THB' });
  const [isSubmit, setIsSubmit] = useState(false);

  const currOption = [
    { type: "", display: "Choose Currency" },
    { type: "USD", display: "USD - US Dollar" },
    { type: "EUR", display: "EUR - Euro" },
    { type: "CAD", display: "CAD - Canadian Dollar" },
    { type: "AUD", display: "AUD - Australia Dollar" },
    { type: "THB", display: "THB - Thai Baht" },
  ];

  // useEffect(
  //   function fetchData() {
  //     async function fetchCurr() {
  //       try {
  //       const conTotalAmount = await axios.post('localhost:8080/convert', inputs);
  //       console.log(conTotalAmount)   
  //       getValue(inputs, conTotalAmount);
  //       } catch (e) {
  //         console.log(e.stack);
  //       }
  //     }
  //     fetchCurr();
  //   }, [isSubmit]
  // );
  const fetchCurr = () => {
    axios.post('http://localhost:8080/convert', inputs)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    // setIsSubmit(true);
    fetchCurr();
    
  };

  const handleChange = (e) => {
    getType(e.target);
  };

  const getType = (currType) => {
    // tempting for assigning curr type
    setInputs((newInputs) => {
      setIsSubmit(false);
      return {
        ...newInputs,
        [currType.name]: currType.value,
      };
    });
  };


  const handleSwap = () => {
    console.log("SWAP!!!");
    const { amount, from, to } = inputs;
    const newInput = { amount: amount, from: to, to: from };
    setInputs(newInput);
    // const newInput = { amount: amount, from: { type: to.type, rate: 1 }, to: { type: from.type, rate: from.rate === to.rate ? from.rate : from.rate / to.rate } };
  }
  console.log("inputs -> ", inputs);

  return (
    <form onSubmit={onSubmit} >
      <label htmlFor="amount">Amount</label>
      <input id="amount" type="text" name="amount" placeholder={inputs.amount} onChange={handleChange} />
      {/* <CurrType type="from" getType={getType} defaultType={inputs.from} /> */}
      <label htmlFor="from">From</label>
      <select name="from" id="from" onChange={handleChange} value={inputs.from} >
        {currOption.map((curr) => (
          <option key={curr.type} value={curr.type} >{curr.display}</option>
        ))}
      </select>
      <button type="button" className="swap" onClick={handleSwap} >Swap</button>
      {/* <CurrType type="to" getType={getType} defaultType={inputs.to} /> */}
      <label htmlFor="to">To</label>
      <select name="to" id="to" onChange={handleChange} value={inputs.to} >
        {currOption.map((curr) => (
          <option key={curr.type} value={curr.type} >{curr.display}</option>
        ))}
      </select>
      <button>Convert</button>
    </form>
  )
};

export default Convertor;

