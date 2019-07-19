import moment from 'moment'
import web3 from 'web3'

const BN = web3.utils.BN;

const BN_1e24 = new BN(10).pow(new BN(24));
const BN_MAX_BIT = 53;

const MAX = 88888888888

const pad = (num) => {
    return ('0' + num).slice(-2);
}

export function thousands(nStr) {
	nStr += '';
	let x = nStr.split('.');
	let x1 = x[0];
	let x2 = x.length > 1 ? '.' + x[1] : '';
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

export function cutString (s) {
    if (!s) return s
    if (s.length < 20) return s
    var first5 = s.substring(0, 5).toLowerCase()
    var last3 = s.slice(-3)
    return first5 + '...' + last3
}

export function weiToNUSD (wei) {
    let value = web3.utils.toBN(wei);
    if (value.bitLength() <= BN_MAX_BIT) {
        value = value.toNumber() / 1e6
    } else {
        value.divn(1e6)
    }
    return thousands(value)
}

export function weiToMNTY (wei) {
    let value = web3.utils.toBN(wei);
    if (value.bitLength() > BN_MAX_BIT) {
        const bitDiff = value.bitLength() - BN_1e24.bitLength() + 1;
        const toShift = BN_MAX_BIT - bitDiff;
        if (toShift > 0) {
            value = value.shln(toShift).div(BN_1e24).toNumber() / 2**toShift;
        } else {
            value = value.div(BN_1e24)
        }
    } else {
        value = value.toNumber() / 1e24
    }
    return thousands(value)
}

export function weiToPrice(mnty, nusd, decimal) {
    mnty = web3.utils.toBN(mnty);
    nusd = web3.utils.toBN(nusd);
    // asume that mnty is much larger than nusd
    let price = mnty.div(nusd);
    if (price.bitLength() > BN_MAX_BIT) {
        price = new BN(10).pow(new BN(18+decimal)).div(price).toNumber() / (10**decimal);
    } else {
        price = 1e18 / price.toNumber();
    }
    return price;
}

// string
export function weiToEthS (weiAmount) {
    if (isNaN(weiAmount)) return 'Loading'
    return (weiAmount * 1e-18).toLocaleString('en', {maximumFractionDigits: 4})
}

export function hhmmss(_secs) {
    var secs = _secs
    var minutes = Math.floor(secs / 60)
    secs = secs % 60;
    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    var days = Math.floor(hours / 24)
    hours = hours % 24
    if (days >= 1) return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(secs)}`
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
}

export function charFormatNoSpace (s) {
    return cutString(s.replace(/[^a-zA-Z0-9,.?!]/ig, ''))
}

export function mmss(endTime) {
    const dateTime = new Date().getTime();
    const timestamp = Math.floor(dateTime / 1000);
    let secs = timestamp > endTime ? 0 : endTime - timestamp
    var minutes = Math.floor(secs / 60)
    secs = secs % 60
    return `${pad(minutes)}:${pad(secs)}`;
    // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
}

// unit = second
export function getTimeDiff(endTime) {
    var now = moment().unix()
    return Number(endTime) - now
}

// dice helper

export function getRoundStatus(_roundInfo) {
    // console.log('Time Diff. (s) =', getTimeDiff(Number(_roundInfo[6])))
    // console.log('getCurRoundInfo = ', _roundInfo)
    // console.log('trueSum', weiToEthS(_roundInfo[0]))
    // console.log('falseSum', weiToEthS(_roundInfo[1]))
    // console.log('trueLength', _roundInfo[2])
    // console.log('falseLength', _roundInfo[3])
    // console.log('curBlockNr', _roundInfo[4])
    // console.log('keyBlockNr', _roundInfo[5])
    // console.log('endTime', _roundInfo[6])
    // console.log('finalize', _roundInfo[7])
    // console.log('refunded', _roundInfo[8])
    // console.log('winTeam', _roundInfo[9])
    var endTime = Number(_roundInfo[6])
    var curBlockNr = Number(_roundInfo[4])
    var keyBlockNr = Number(_roundInfo[5])
    var finalized = Boolean(_roundInfo[7])
    if (endTime === MAX) return 'waiting'
    var timer = getTimeDiff(endTime)
    if ((timer > 0) && (keyBlockNr > curBlockNr)) return 'running'
    if (finalized) return 'finalized'
    // round locked but unable to draw results
    return 'pending'

}
