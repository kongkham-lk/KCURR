import axios from "axios";

var request = new XMLHttpRequest();
var retries = {count: 2};
var baseUrl = "n/a";

export function getFlag(currCountry) {
    // if (baseUrl === "n/a") {
    //     const tempURL = await testFlagAPI();
    //     baseUrl = tempURL;
    //     console.log("Final baseUrl is: ", baseUrl);
    // }

    if (currCountry == null || currCountry.substring(0, 1) === "X") {
        return <div style={style.divGetFlag} >{currCountry}</div>
    } else {
        return <img style={style.img} src={getBaseUrl(currCountry, baseUrl)} alt="" />
    }
};

const getBaseUrl = (currCountry, baseUrl) => {
    let link = `https://flagcdn.com/32x24/${currCountry.substring(0, 2).toLowerCase()}.png`;
    return link;
}

async function testFlagAPI() {
    let url = getNextFlagAPI();
    if (url === ""){
        console.log("Empty URL!!!");
        return "";
    }
    const samepleFlagAPI = url + "th.png"
    console.log("samepleFlagAPI: ", samepleFlagAPI);
    let responseOK = false;
    // await axios.get(samepleFlagAPI)
    //     .then(function (response) {
    //         // handle success
    //         console.log("response: ", response);
    //         if (response.status === 200) {
    //             console.log("return url: ", url);
    //             return url;
    //         } else {
    //             console.log("test next url!!!");
    //             return testFlagAPI();  
    //         }
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log("error: ", error);
    //     });
    await fetch(samepleFlagAPI, {mode: 'no-cors'})
        .then(response => {
            console.log("response.status: => ", response.status);
            
            // if (response.status === 0) {
            //     setTimeout(() => {
            //         console.log("Delayed for 1 second.");
            //       }, "1000");
            // }
            
            if (response.status === 200) {
                console.log("return url: ", url);
                return url;
            } else if (response.status === 0) {
                console.log("return n/a!!!");
                return "n/a";
            } else {
                console.log("test next url!!!");
                return testFlagAPI();  
            }
        })
        .catch(error => {
            console.log("error: ", error);
        });
}

const getNextFlagAPI = () => {
    retries.count -= 1;
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
        return "https://www.countryflagicons.com/SHINY/32/"
    }
    else if (retries.count === 0){
        console.log("test url 0");
        return "";
    }
}

const style = {
    img: { margin: "0 10px 0px 0px" },
}