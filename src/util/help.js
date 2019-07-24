import moment from 'moment'
import web3 from 'web3'

const BN = web3.utils.BN;

const BN_1e6 = new BN(10).pow(new BN(6));
const BN_1e18 = new BN(10).pow(new BN(18));
const BN_1e24 = new BN(10).pow(new BN(24));
const BN_MAX_BIT = 53;
const BN_ZOOM_BIT = 18;

const MAX = 88888888888

const pad = (num) => {
    return ('0' + num).slice(-2);
}

export function thousands(nStr, decimal = 4) {
	nStr += '';
	let x = nStr.split('.');
	let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    if (x2.length > decimal + 1) {
        x2 = x2.substring(0, decimal + 1);
    }
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

export function intShift(s, d) {
    s = s.toString();
    if (d === 0) {
        return s;
    }
    if (d > 0) {
        return s + '0'.repeat(d);
    } else {
        if (s.length <= d) {
            return 0;
        }
        return s.substring(0, s.length - d);
    }
}

export function decShift(s, d) {
    s = s.toString();
    if (d == 0) {
        return s;
    }
    let f = '';
    let p = s.indexOf('.');
    if (p >= 0) {
        f = s.substring(p+1); // assume that s.length > p
        s = s.substring(0, p);
    }
    if (d > 0) {
        if (d < f.length) {
            s += f.substring(0, d);
            f = f.substring(d+1);
            return s + '.' + f;
        }
        // d > f.length
        return intShift(s + f, d - f.length);
    }
    // d < 0
    d = -d
    if (d < s.length) {
        f = s.substring(s.length - d) + f;
        s = s.substring(0, s.length - d);
        f = f.replace(/0+$/g, "");
        if (f.length > 0) {
            s += '.' + f;
        }
        return s;
    }
    // d > s.length
    f = '0'.repeat(d - s.length) + s + f;
    f = f.replace(/0+$/g, "");
    if (f.length > 0) {
        return '0' + '.' + f;
    }
    return '0';
}

export function weiToMNTY(wei) {
    return decShift(wei, -24);
}

export function weiToNUSD(wei) {
    return decShift(wei, -6);
}

export function weiToPrice(mnty, nusd) {
    const price = div(web3.utils.toBN(decShift(nusd, 18)), web3.utils.toBN(mnty))
    return price.toString()
}

// string
export function weiToEthS (weiAmount) {
    if (isNaN(weiAmount)) return 'Loading'
    return (weiAmount * 1e-18).toLocaleString('en', {maximumFractionDigits: 4})
}

// (BN / BN) => string
function div(a, b) {
    if (a.isZero()) {
        return 0;
    }
    if (a.lt(b)) {
        return 1 / _div(b, a);
    }
    return _div(a, b);
}

function _div(a, b) {
    const resultBitLen = a.bitLength() - b.bitLength() + 1;
    // zoom the result to BN_MAX_BIT
    const toShift = BN_ZOOM_BIT - resultBitLen;
    if (toShift > 0) {
        a = a.shln(toShift);
    } else if (toShift < 0) {
        b = b.shln(-toShift);
    }
    let c = a.div(b).toNumber();
    // assert(c.bitLength() <= BN_MAX_BIT)
    if (toShift > 0) {
        c /= 1<<toShift
    } else if (toShift < 0) {
        c *= 1<<-toShift
    }
    return c;
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