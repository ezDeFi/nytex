import moment from 'moment'

const MAX = 88888888888

const pad = (num) => {
    return ('0' + num).slice(-2);
}

export function cutString (s) {
    if (!s) return s
    if (s.length < 20) return s
    var first5 = s.substring(0, 5).toLowerCase()
    var last3 = s.slice(-3)
    return first5 + '...' + last3
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
