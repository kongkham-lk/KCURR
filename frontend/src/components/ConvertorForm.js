import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// import { useState, useEffect } from 'react';
import axios from 'axios';
import CurrAmount from './CurrAmount'
import CurrType from './CurrType'

function Convertor({ getValue }) {
  const [inputs, setInputs] = useState({ amount: 0, sourceCurr: 'USD', targetCurr: 'THB' });

  const fetchConvert = async () => {
    try {
      const response = await axios.post('http://localhost:8080/convert', inputs);
      console.log("response: ", response)
      getValue(inputs, response);
    } catch (e) { 
      console.log(e.code, "\n", e.stack);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(inputs)
    // setIsSubmit(true);
    fetchConvert();
  };

  const handleChange = (e) => {
    console.log(e.value, "'s type is: ", typeof e.value)
    let convAmountType = "";
    if (e.name === 'amount') {
      convAmountType = parseFloat(e.value);
    }
    // console.log(convAmountType, "'s type is: ", typeof convAmountType);
    // tempting for assigning curr type
    setInputs((newInputs) => {
      // setIsSubmit(false);
      return {
        ...newInputs,
        [e.name]: convAmountType === "" ? e.value : convAmountType,
      };
    });
  };

  const handleSwap = () => {
    console.log("SWAP!!!");
    const { amount, sourceCurr, targetCurr } = inputs;
    const newInput = { amount: amount, sourceCurr: targetCurr, targetCurr: sourceCurr };
    setInputs(newInput);
  }
  console.log("inputs -> ", inputs);

  return (
    <form onSubmit={onSubmit} >
      <Stack spacing={3} direction="row" flexWrap="wrap" sx={{ marginBottom: 2 }}>
        <CurrAmount amount={inputs.amount} updateVal={handleChange} />
        <CurrType label="From" type="sourceCurr" updateVal={handleChange} defaultType={inputs.sourceCurr} />
        <Button variant="outlined" type="submit" className="swap" onClick={handleSwap} sx={{ borderRadius: "32px", width: "50px"}} ><img src="https://t3.ftcdn.net/jpg/02/69/49/94/360_F_269499484_66ndPqItHQ5NEt7TBeaDAJgCukBlQzPN.jpg" alt="arrow" style={{objectFit: "cover", height: "40px", mixBlendMode: "multiply"}} /></Button>
        <CurrType label="To" type="targetCurr" updateVal={handleChange} defaultType={inputs.targetCurr} />
      </Stack>
      <Button variant="contained" type="submit" style={{ marginTop: "5px" }}>Convert</Button>
    </form>
  )
};

export default Convertor;

