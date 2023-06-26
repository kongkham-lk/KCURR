import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
import CurrAmount from './CurrAmount'
import CurrType from './CurrType'

function Convertor({ getValue }) {
  const [inputs, setInputs] = useState({ amount: 0, from: 'USD', to: 'THB' });
  // const [isSubmit, setIsSubmit] = useState(false);

  const currOption = [
    { type: "", display: "Choose Currency" },
    { type: "USD", display: "USD - US Dollar" },
    { type: "EUR", display: "EUR - Euro" },
    { type: "CAD", display: "CAD - Canadian Dollar" },
    { type: "AUD", display: "AUD - Australian Dollar" },
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

  // const fetchCurr = () => {
  //   axios.post('http://localhost:8080/convert', inputs)
  //     .then(function (response) {
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(inputs)
    // setIsSubmit(true);
    // fetchCurr();
  };

  // const handleChange = (e) => {
  //   updateVal(e.target);
  // };

  const handleChange = (e) => {
    // tempting for assigning curr type
    setInputs((newInputs) => {
      // setIsSubmit(false);
      return {
        ...newInputs,
        [e.name]: e.value,
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
      <Stack spacing={3} direction="row" flexWrap="wrap" sx={{ marginBottom: 2 }}>
        <CurrAmount amount={inputs.amount} updateVal={handleChange} />
        <CurrType type="from" updateVal={handleChange} currOption={currOption} defaultType={inputs.from}/>
        <Button variant="outlined" type="button" className="swap" onClick={handleSwap} >Swap</Button>
        <CurrType type="to" updateVal={handleChange} currOption={currOption} defaultType={inputs.to}/>
      </Stack>
      <Button variant="contained" type="submit" >Convert</Button>
    </form>
  )
};

export default Convertor;

