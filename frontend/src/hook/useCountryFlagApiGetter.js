import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCountryFlagApiGetter() {
    const [retries, setRetries] = useState(1);
    const [validFlagEndpoint, setValidFlagApiEndpoint] = useState("https://www.countryflagicons.com/SHINY/32/");
    const [isFlagReady, setIsFlagReady] = useState(false);

    useEffect(
        function useCountryFlagApiGetter() {
            async function fetchValidFlagEndpoint() {
                let resFlagEndpointData = null;

                try {
                    let response = await axios.get(validFlagEndpoint, {
                            responseType: 'arraybuffer' 
                        });
                    resFlagEndpointData = Buffer.from(response.data, 'binary').toString('base64');
                } catch (e) {
                    console.log(e.stack);
                }

                console.dir("resFlagEndpoint: ", resFlagEndpointData);

                if (resFlagEndpointData !== undefined || resFlagEndpointData !== null) {
                    setIsFlagReady(true);
                } else {
                    setValidFlagApiEndpoint(getNextFlagAPI(retries));
                    setRetries(retries - 1);
                }
            }
            fetchValidFlagEndpoint();
        }, [validFlagEndpoint]
    );
    return {validFlagEndpoint, isFlagReady: isFlagReady };

    function getNextFlagAPI (retries) {
        if (retries.count === 0) {
            console.log("test url 1");
            return "https://countryflagsapi.netlify.app/flag/";
        }
        else if (retries.count === 1) {
            console.log("test url 2");
            return "https://flagcdn.com/32x24/";
        }
        else if (retries.count === 2) {
            console.log("test url 3");
            return "https://www.countryflagicons.com/SHINY/32/";
        }
        else if (retries.count === -1){
            console.log("test url 0");
            return "";
        }
    }
};
