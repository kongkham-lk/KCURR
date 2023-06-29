// import axios from 'axios';


// // const CurrOption = [
// //     { type: "", display: "Choose Currency" },
// //     { type: "USD", display: "USD - US Dollar" },
// //     { type: "EUR", display: "EUR - Euro" },
// //     { type: "CAD", display: "CAD - Canadian Dollar" },
// //     { type: "AUD", display: "AUD - Australian Dollar" },
// //     { type: "THB", display: "THB - Thai Baht" },
// // ];



// const CurrOption = async () => {
//     try {
//         const responseCurrOption = await axios.post('localhost:8080/api/exchagne-rate');
//         console.log("responseCurrOption => \n", responseCurrOption, "\n")
//         return getCurrOpt(responseCurrOption);
//     } catch (e) {
//         console.log(e.stack);
//     }
// }

// function getCurrOpt(responseCurrOption) {
//     const [supported_codes] = responseCurrOption;
//     const option = supported_codes.map(el => (
//         { type: el[0], display: el[1] }
//     ))
//     console.log("getCurrOpt: =>\n", option)
//     return option;
// }

// export default CurrOption;