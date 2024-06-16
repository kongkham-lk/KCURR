export function getFlag(currCountry) {
    if (currCountry == null || currCountry.substring(0, 1) === "X") {
        return <div style={{...style.flagImg, ...style.divGetFlag}} >{currCountry}</div>
    } else {
        const url = getBaseUrl(currCountry);
        if (UrlExists(url))
            return <img style={style.flagImg} src={getBaseUrl(currCountry)} alt=""/>
        else
            return <div style={{...style.flagImg, ...style.divGetFlag}} >{currCountry}</div>
    }
};

const getBaseUrl = (currCountry) => {
    return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${currCountry.substring(0, 2).toUpperCase()}.svg`;
}
function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if (http.status != 404)
        return true;
    else
        return false;
}

const style = {
    flagImg: { margin: "0 10px 0px 0px", width: '35px', background: '#c6c6c6'},
    divGetFlag: { fontSize: '0.6rem', textAlign: 'center', padding: '5.5px 0px', fontWeight: 'bolder'},
}