// import React from 'react';
import { useState } from 'react';
// import { v4 as uuid } from "uuid";
import Button from 'react-bootstrap/Button';
// import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';


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
    // console.log(e);
    setInputs((oldInputs) => {
      return {
        ...oldInputs,
        [e.target.name]: e.target.value
      };
    });
  };

  const handleSwap = () => {
    console.log("SWAP!!!");
    const { amount, from, to } = inputs;
    const newInput = { amount: amount, from: to, to: from };
    setInputs(newInput);
  }


  console.log(inputs);

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3" style={{ alignItems: "flex-end" }}>
        <Form.Group className="col" md="4" style={{
          flex: "0.6 1"
        }}>
          <Form.Label htmlFor="amount">Amount</Form.Label>
          <InputGroup>
            <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
            <Form.Control id="amount" name="amount" type="text" placeholder="1.00" onChange={handleChange} value={inputs.amount > 0 ? inputs.amount : ""} />
          </InputGroup>
        </Form.Group>
        <Form.Group className="col-md" md="4" >
          <Form.Label htmlFor="from" >From</Form.Label>
          <Form.Select name="from" id="from" onChange={handleChange} >
            {currOption.map((curr) => (
              <option value={curr.type} selected={curr.type === inputs.from}>{curr.display}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="col" md="4" style={{
          flex: 0
        }}>
          <Button type="button" variant="outline-primary" className="swap" onClick={handleSwap}>Swap</Button>
        </Form.Group>
        <Form.Group className="col-md" md="4" >
          <Form.Label htmlFor="to" >To</Form.Label>
          <Form.Select name="to" id="to" onChange={handleChange} >
            {currOption.map((curr) => (
              <option value={curr.type} selected={curr.type === inputs.to}>{curr.display}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Row>
      <Button className="float-end" variant="primary" >Convert</Button>
    </Form>
  )
}

export default Convertor;