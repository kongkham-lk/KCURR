import { useState } from 'react';
import Button from '@mui/material/Button';
import InputTextField from '../InputTextField';
import CurrCountriesDropDown from '../CurrCountriesDropDown';
import { checkIfContainsOnlyNumbers } from '../../util/checkingMethods';
import { retrieveConvertValue } from '../../util/apiClient';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function ConvertorForm(props) {
  const isMobileScreen = useMediaQuery('(max-width:414px)');
  const { setFormDataToConvertor, currCountiesCodeMapDetail, currInput } = props;

  const [formInputs, setFormInputs] = useState({ amount: 0, baseCurr: currInput.baseCurr, targetCurr: currInput.targetCurr });
  const [isError, setIsError] = useState(false);

  const handleAmountInput = (e) => {
    if (checkIfContainsOnlyNumbers(e.value) || e.value === "") {
      setIsError(false);
    } else {
      setIsError(true);
    }

    const convertAmountInput = parseFloat(e.value);

    setFormInputs((oldFormInputs) => {
      return {
        ...oldFormInputs,
        [e.name]: convertAmountInput,
      };
    });
  }

  const handleCurrCountryForm = (e) => {
    setFormInputs((oldFormInputs) => {
      return {
        ...oldFormInputs,
        [e.name]: e.value,
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
    retrieveConvertValue(setFormDataToConvertor, formInputs);
  };

  return (
    <form onSubmit={onSubmit} >
      <div spacing={3} style={isMobileScreen ? sxStyle.FormShrink : sxStyle.FormExpand} flexDirection={isMobileScreen ? "column" : "row"}>
        <InputTextField updateVal={handleAmountInput} isError={isError} baseCurr={formInputs.baseCurr} currCountiesCodeMapDetail={currCountiesCodeMapDetail} inputFieldLabel="amount" placeHolder="Enter Number" />
        <CurrCountriesDropDown sxStyle={sxStyle.CurrCountriesDropDown} label="From" stateInputField="baseCurr" updateVal={handleCurrCountryForm} baseCurrVal={formInputs.baseCurr} currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
          <Button variant="outlined" type="submit" onClick={handleSwap} sx={sxStyle.swapButton} disabled={isError ? true : false} >
            <img src={embedLink.swapArrow} alt="Swap Arrow" style={isMobileScreen ? style.imgTransform : style.img} />
          </Button>
        <CurrCountriesDropDown sxStyle={sxStyle.CurrCountriesDropDown} label="To" stateInputField="targetCurr" updateVal={handleCurrCountryForm} baseCurrVal={formInputs.targetCurr} currCountiesCodeMapDetail={currCountiesCodeMapDetail} />
      </div>
      <Button variant="contained" type="submit" style={style.convertButton} disabled={isError ? true : false} >
        Convert
      </Button>
    </form >
  )
};

const embedLink = { swapArrow: "https://t3.ftcdn.net/jpg/02/69/49/94/360_F_269499484_66ndPqItHQ5NEt7TBeaDAJgCukBlQzPN.jpg" };

const style = {
  convertButton: { marginTop: "18px" },
  img: { objectFit: "cover", height: "40px", mixBlendMode: "multiply" },
  imgTransform: { objectFit: "cover", height: "40px", mixBlendMode: "multiply", transform: "rotate(90deg)"},
  div: { marginTop: "1%" },
};

const sxStyle = {
  CurrCountriesDropDown: { minWidth: 1 / 4, width: 'auto' },
  FormExpand: { display: "flex", alignItems: "center", flexWrap: "nowrap", flexDirection:"row", justifyContent: "space-between",
                  gap: "10px", padding: "0", },
  FormShrink: { display: "flex", flexWrap: "nowrap", flexDirection:"column", justifyContent: "space-between",
                  gap: "20px", padding: "0", },
  swapButton: { borderRadius: "32px", width: "30px", height: "40px", borderColor: "#afaeae" },
};