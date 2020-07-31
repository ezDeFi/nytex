import BaseService from '../../model/BaseService'
import _ from 'lodash'
import { thousands, weiToNUSD, weiToMNTY, weiToPrice, cutString, decShift } from '@/util/help'
import BigInt from 'big-integer';
export default class extends BaseService {
    deposit(amount) {
        const web3 = store.user.web3
        return web3.eth.sendTransaction({
            to: store.contracts.governance._address,
            from: store.user.wallet,
            value: amount.toString(),
        })
    }
}
