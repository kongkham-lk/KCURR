import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import CurrAmount from './CurrAmount'
import CurrCountries from './CurrCountries'

export default function Convertor({ getFormData, currApiArr }) {
  const [formInputs, setFormInputs] = useState({ amount: 0, baseCurr: 'USD', targetCurr: 'THB' });
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    let convAmountType = "";

    if (e.name === 'amount') {
      if (containsOnlyNumbers(e.value) || e.value === "") {
        setIsError(false);
      } else {
        setIsError(true);
      }
      convAmountType = parseFloat(e.value);
    }

    setFormInputs((oldFormInputs) => {
      return {
        ...oldFormInputs,
        [e.name]: convAmountType === "" ? e.value : convAmountType,
      };
    });
  };

  const handleSwap = () => {
    const { amount, baseCurr, targetCurr } = formInputs;
    const newFormInput = { amount: amount, baseCurr: targetCurr, targetCurr: baseCurr };
    setFormInputs(newFormInput);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    fetchConvertVal(getFormData, formInputs);
  };

  const swapButton = isError
    ? <Button variant="contained" disabled sx={sxStyle.swapButton}>{EmbedSwapIcon}</Button>
    : <Button variant="outlined" type="submit" className="swap" onClick={handleSwap} sx={sxStyle.swapButton} >{EmbedSwapIcon}</Button>;

  const convertButton = isError
    ? <Button variant="contained" style={style.convertButton} disabled>Convert</Button>
    : <Button variant="contained" type="submit" style={style.convertButton}>Convert</Button>;

  return (
    <form onSubmit={onSubmit} >
      <Stack spacing={3} direction="row" flexWrap="wrap" sx={sxStyle.Stack}>
        <CurrAmount updateVal={handleChange} error={isError} baseCurr={formInputs.baseCurr} currApiArr={currApiArr}/>
        <CurrCountries sxStyle={sxStyle.CurrCountries} label="From" stateInputField="baseCurr" updateVal={handleChange} baseCurrVal={formInputs.baseCurr} currApiArr={currApiArr} />
        {swapButton}
        <CurrCountries sxStyle={sxStyle.CurrCountries} passInStyle={style.Select} label="To" stateInputField="targetCurr" updateVal={handleChange} baseCurrVal={formInputs.targetCurr} currApiArr={currApiArr} />
      </Stack>
      {convertButton}
    </form>
  )
};

function containsOnlyNumbers(str) {
  return /^[0-9.]+$/.test(str);
}

const fetchConvertVal = async (getFormData, formInputs) => {
  try {
    const response = await axios.post('http://localhost:8080/curr/convert', formInputs);
    getFormData(formInputs, response);
  } catch (e) {
    console.log(e.code, "\n", e.stack);
  }
};

const EmbedSwapIcon = (<img
  src="https://t3.ftcdn.net/jpg/02/69/49/94/360_F_269499484_66ndPqItHQ5NEt7TBeaDAJgCukBlQzPN.jpg"
  alt="arrow"
  style={{ objectFit: "cover", height: "40px", mixBlendMode: "multiply" }}
/>);

const style = {
  convertButton: { marginTop: "5px" },
};

const sxStyle = {
  CurrCountries: { m: 1, minWidth: 1/4, width: 250 },
  Stack: { marginBottom: 2, display:"flex", 
  alignItems: "center",
  flexWrap: "nowrap" },
  swapButton: { borderRadius: "32px", width: "30px", height: "40px", borderColor:"#afaeae" },
}