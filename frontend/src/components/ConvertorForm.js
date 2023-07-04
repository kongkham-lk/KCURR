import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import CurrAmount from './CurrAmount'
import CurrType from './CurrType'

const EmbedSwapIcon = (<img
  src="https://t3.ftcdn.net/jpg/02/69/49/94/360_F_269499484_66ndPqItHQ5NEt7TBeaDAJgCukBlQzPN.jpg"
  alt="arrow"
  style={{ objectFit: "cover", height: "40px", mixBlendMode: "multiply" }}
/>);

const styleSwapIcon = {
  borderRadius: "32px",
  width: "50px",
  height: "20%",
};

const styleCurrType = { m: 1, minWidth: 200, width: 250 };

export default function Convertor({ getValue, currOption }) {
  const [inputs, setInputs] = useState({ amount: 0, sourceCurr: 'USD', targetCurr: 'THB' });
  const [error, setError] = useState(false);

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
    fetchConvert();
  };

  function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
  }

  const handleChange = (e) => {
    let convAmountType = "";
    if (e.name === 'amount') {
      if (containsOnlyNumbers(e.value) || e.value === "") {
        setError(false);
      } else {
        setError(true);
      }
      convAmountType = parseFloat(e.value);
    }
    setInputs((newInputs) => {
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

  const swapButton = error
    ? <Button variant="outlined" disabled sx={styleSwapIcon}>{EmbedSwapIcon}</Button>
    : <Button variant="outlined" type="submit" className="swap" onClick={handleSwap} sx={styleSwapIcon} >{EmbedSwapIcon}</Button>;

  const convertButton = error
    ? <Button variant="outlined" style={{ marginTop: "5px" }} disabled>Convert</Button>
    : <Button variant="contained" type="submit" style={{ marginTop: "5px" }}>Convert</Button>;

  return (
    <form onSubmit={onSubmit} >
      <Stack spacing={3} direction="row" flexWrap="wrap" sx={{ marginBottom: 2 }}>
        <CurrAmount amount={inputs.amount} updateVal={handleChange} error={error} />
        <CurrType styling={styleCurrType} label="From" type="sourceCurr" updateVal={handleChange} defaultVal={inputs.sourceCurr} currOption={currOption} />
        {swapButton}
        <CurrType styling={styleCurrType} label="To" type="targetCurr" updateVal={handleChange} defaultVal={inputs.targetCurr} currOption={currOption} />
      </Stack>
      {convertButton}
    </form>
  )
};

