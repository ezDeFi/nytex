// zergity@gmail.com
import Web3 from 'web3';

export const TxCodeAddress = '0x1111111111111111111111111111111111111111'

export function Web3z(provider) {
    const w3 = new Web3(provider)
    w3.exec = function(tx, options) {
        tx = parseTx(tx, options)
        const proxy = new Promise((resolve, reject) => {
            w3.eth.call(tx)
            .then(res => {
                const msg = extractFailureMessage(res)
                if (msg) {
                    reject(msg)
                    return
                }
                const promise = w3.eth.sendTransaction(tx)
                redirectProxyMethods(promise, proxy)
                resolve(promise)
            })
            .catch(err => {
                reject(err)
            })
        })
        return createProxyMethods(proxy)
    }
    w3.execCode = function(tx) {
        tx.to = TxCodeAddress
        return w3.exec(tx)
    }
    console.log("Web3z.exec injected")
    return w3
}

function parseTx(tx, options) {
    if (typeof tx.encodeABI === "function") {
        const method = tx
        tx = Object.assign({}, options)
        if (tx.from === undefined) {
            tx.from = method._parent.givenProvider.selectedAddress
        }
        if (tx.to === undefined) {
            tx.to = method._parent._address
        }
        if (tx.data) {
            throw "unexpected tx data"
        }
        tx.data = method.encodeABI()
        return tx
    }

    if (tx.to === TxCodeAddress) {
        if (!tx.gasLimit) {
            tx.gasLimit = 6000000
        }
        if (tx.data) {
            // trim the compiler signature code
            const idxFE = tx.data.indexOf('fea265627a7a72315820');
            if (idxFE >= 0) {
                tx.data = tx.data.substring(0, idxFE);
            }
            // prepend the hex signature '0x' if nessesary
            if (!tx.data.startsWith('0x')) {
                tx.data = '0x' + tx.data;
            }
        }
    }
    return tx
}

function redirectProxyMethods(promise, proxy) {
    for (const [event, handler] of Object.entries(proxy._h)) {
        promise.on(event, handler)
    }
    for (const [event, handler] of Object.entries(proxy._o)) {
        promise.once(event, handler)
    }
    return promise
}

function createProxyMethods(proxy) {
    proxy._h = {}
    proxy._o = {}

    proxy.listeners = (event, exists) => {
        // TODO: _onceHandlers
        return proxy._h[event]
    }
    proxy.once = (event, handler) => {
        proxy._o[event] = handler
        return proxy
    }
    proxy.on = (event, handler) => {
        proxy._h[event] = handler
        return proxy
    }
    proxy.off = (event) => {
        delete proxy._h[event]
        delete proxy._o[event]
        return proxy
    }
    proxy.removeAllListeners = () => {
        proxy._h = {}
        proxy._o = {}
    }
    proxy.addListener = proxy.on
    proxy.removeListener = proxy.off
    return proxy
}

// Keccak("Error(string)")
const SolidityErrorSignature = "08c379a0"
// Keccak("Error")
const ZergityErrorSignature = "e342daa4"

function extractFailureMessage(res) {
    if (res.startsWith("0x")) {
        res = res.substring(2);
    }
    if (res.startsWith(ZergityErrorSignature)) {
        return hex2ASCII(res.substring(4*2));
    }
    // look for solidity revert message
    if (res.length < 2*(4+32+32)) {
        return;
    }
    if (!res.startsWith(SolidityErrorSignature)) {
        return;
    }
    res = res.substring(4*2);
    const offset = parseInt(res.substring(0, 32*2), 16) * 2;
    res = res.substring(32*2);
    const size = parseInt(res.substring(0, 32*2), 16) * 2;
    if (res.length < offset+size) {
        return;
    }
    res = res.substring(offset, offset+size);
    return hex2ASCII(res);
}

function hex2ASCII(str1) {
    var hex  = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}
