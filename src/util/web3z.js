import Web3 from 'web3';

export function Web3z(provider) {
    const w3 = new Web3(provider)
    w3.exec = function(method, options) {
        const tx = Object.assign({}, options)
        if (tx.from === undefined) {
            tx.from = method._parent.givenProvider.selectedAddress
        }
        if (tx.to === undefined) {
            tx.to = method._parent._address
        }
        // if (tx.value) {
        //     w3.eth.getBalance(tx.from).then(balance => {
        //         if (BigInt(balance) < BigInt(tx.value)) {
        //             throw "insufficient balance"
        //         }
        //     })
        // }
        if (tx.data) {
            throw "unexpected tx data"
        }
        tx.data = method.encodeABI()

        const proxy = new Promise((resolve, reject) => {
            w3.eth.call(tx)
            .then(res => {
                const msg = extractFailureMessage(res)
                if (msg) {
                    reject(msg)
                    return
                }
                const promise = w3.eth.sendTransaction(tx)
                for (const [event, handler] of Object.entries(proxy._handlers)) {
                    promise.on(event, handler)
                }
                for (const [event, handler] of Object.entries(proxy._oncesHandlers)) {
                    promise.once(event, handler)
                }
                resolve(promise)
            })
            .catch(err => {
                reject(err)
            })
        })

        proxy._handlers = {}
        proxy._oncesHandlers = {}

        proxy.listeners = (event, exists) => {
            // TODO: _onceHandlers
            return proxy._handlers[event]
        }
        proxy.once = (event, handler) => {
            proxy._oncesHandlers[event] = handler
            return proxy
        }
        proxy.on = (event, handler) => {
            proxy._handlers[event] = handler
            return proxy
        }
        proxy.off = (event) => {
            delete proxy._handlers[event]
            delete proxy._oncesHandlers[event]
            return proxy
        }
        proxy.removeAllListeners = () => {
            proxy._handlers = {}
            proxy._oncesHandlers = {}
        }
        proxy.addListener = proxy.on
        proxy.removeListener = proxy.off
        return proxy
    }
    console.log("Web3z.exec injected")
    return w3
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
