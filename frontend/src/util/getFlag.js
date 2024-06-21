export function getFlag(currCountry, invalidCurFlagList) {
    if (isValidParam(currCountry) && !invalidCurFlagList.includes(currCountry))
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

export async function getInvalidCurrFlagList(currCodes) {
    let invalidCurFlagList = [];
    console.log("log currCodes: ", currCodes);
    for (let currCode of currCodes) {
        const url = getBaseUrl(currCode);
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (response.status !== 200) {
                console.log("add invalidCurFlag: ", currCode);
                invalidCurFlagList = [...invalidCurFlagList, currCode];
            }
        } catch (error) {
            console.error(`Error checking URL for ${currCode}:`, error);
        }
    }
    console.log("log invalidCurFlag: ", invalidCurFlagList);
    return invalidCurFlagList;
}

const style = {
    flagImg: { margin: "0 10px 0px 0px", width: '35px', background: '#c6c6c6'},
    divGetFlag: { fontSize: '0.6rem', textAlign: 'center', padding: '5.5px 0px', fontWeight: 'bolder'},
}