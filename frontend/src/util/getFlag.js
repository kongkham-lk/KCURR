export function getFlag(currCountry) {
    if (isValidParam(currCountry))
        return <img style={style.flagImg} src={getBaseUrl(currCountry)} alt=""/>
    else
        return <div style={{...style.flagImg, ...style.divGetFlag}} >{currCountry}</div>
};

const isValidParam = (currCountry) => {
    if (!(currCountry == null || currCountry.substring(0, 1) === "X") && isUrlExists(getBaseUrl(currCountry)))
        return true;
    else 
        return false;
}

const getBaseUrl = (currCountry) => {
    return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${currCountry.substring(0, 2).toUpperCase()}.svg`;
}

const isUrlExists = (url) => {
    var req = new XMLHttpRequest();
    req.open('HEAD', url, false);
    req.send();
    return req.status === 200;
}

const style = {
    flagImg: { margin: "0 10px 0px 0px", width: '35px', background: '#c6c6c6'},
    divGetFlag: { fontSize: '0.6rem', textAlign: 'center', padding: '5.5px 0px', fontWeight: 'bolder'},
}