import BaseService from '../model/BaseService'
import _ from 'lodash'
import ERC20abi from '@/../abi/ERC20.abi.json'

const acfgAddress = '0x2222222222222222222222222222222222222222'

function strip0x(a) {
    if (a && a.startsWith('0x')) {
        return a.substring(2)
    }
    return a
}

export default class extends BaseService {
    get(key) {
        const store = this.store.getState()
        return store.user.web3.eth.getStorageAt(store.user.wallet, key)
    }
    set(key, value) {
        const store = this.store.getState()
        return store.user.web3.eth.sendTransaction({
            from: store.user.wallet,
            to: acfgAddress,
            data: key + strip0x(value),
        })
    }
    erc20Symbol(address) {
        const store = this.store.getState()
        const web3 = store.user.web3
        const token = new web3.eth.Contract(ERC20abi, address)
        return token.methods.symbol().call()
    }
}
