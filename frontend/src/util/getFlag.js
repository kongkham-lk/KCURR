export function getFlag(currCountry) {
    if (currCountry == null || currCountry.substring(0, 1) === "X") {
        return <div style={style.divGetFlag} >{currCountry}</div>
    } else {
        return <img style={style.img} src={getBaseUrl(currCountry)} alt="" />
    }
};

const getBaseUrl = (currCountry) => {
    return `https://flagcdn.com/32x24/${currCountry.substring(0, 2)}.png`;
}

const style = {
    img: { margin: "0 10px 0px 0px" },
}