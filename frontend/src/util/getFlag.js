export function getFlag(currCountry) {
    if (currCountry == null || currCountry.substring(0, 1) === "X") {
        return <div style={style.divGetFlag} >{currCountry}</div>
    } else {
        return <img style={style.flagImg} src={getBaseUrl(currCountry)} alt="" />
    }
};

const getBaseUrl = (currCountry) => {
    return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${currCountry.substring(0, 2).toUpperCase()}.svg`;
}

const style = {
    flagImg: { margin: "0 10px 0px 0px", width: '35px' },
}