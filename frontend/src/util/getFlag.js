import axios from 'axios';
import cheerio from 'cheerio';
export function getFlag(currCountry, validCurFlagList) {
    if (isValidParam(currCountry) && validCurFlagList.includes(currCountry.substring(0, 2).toUpperCase()))
        return <img style={style.flagImg} src={getBaseUrl(currCountry)} alt=""/>
    else
        return <div style={{...style.flagImg, ...style.divGetFlag}} >{currCountry}</div>
};

const isValidParam = (currCountry) => {
    if (currCountry == null || currCountry.substring(0, 1) === "X")
        return false;
    else 
        return true;
}

const getBaseUrl = (currCountry) => {
    return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${currCountry.substring(0, 2).toUpperCase()}.svg`;
}

// fetch all the available flag code from the API provider, BeaconAPI, which are provided in the form of HTML
// then getFlag() can use the return array from this funtion to determined what to return as the result.
// this will be invoke only once, at the very start stage.
export async function fetchAllCountryFlags() {
    try {
        // Fetch the HTML content
        const { data } = await axios.get('https://catamphetamine.gitlab.io/country-flag-icons/3x2/');
        // Load the HTML into cheerio
        const $ = cheerio.load(data);

        // Initialize an array to store the results
        const countryFlags = [];

        // Iterate over each section with class 'Country'
        $('section.Country').each((index, element) => {
            const countryCode = $(element).find('h1').text().trim();

            // Push the result into the array
            countryFlags.push(countryCode);
        });

        // Return the result
        return countryFlags;
    } catch (error) {
        console.error('Error fetching country flags:', error);
        return [];
    }
}

const style = {
    flagImg: { margin: "0 10px 0px 0px", width: '35px', background: '#c6c6c6'},
    divGetFlag: { fontSize: '0.6rem', textAlign: 'center', padding: '5.5px 0px', fontWeight: 'bolder'},
}