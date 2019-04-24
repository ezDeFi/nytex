import BaseService from '../../model/BaseService'
import _ from 'lodash'

export default class extends BaseService {
    // Send Fundtions
    async depositFor(_toAddress, _amount) {
        const store = this.store.getState()
        let methods = store.contract.serc.methods
        let wallet = store.user.walletAddress
        return await methods.depositFor(_toAddress).send({from: wallet, value: _amount})
    }

    async deposit(_amount) {
        const store = this.store.getState()
        let methods = store.contract.serc.methods
        let wallet = store.user.walletAddress
        return await methods.deposit().send({from: wallet, value: _amount})
    }

    async withdraw(_amount) {
        const store = this.store.getState()
        let methods = store.contract.serc.methods
        let wallet = store.user.walletAddress
        return await methods.withdraw(_amount.toString()).send({from: wallet})
    }

    // Call Functions

    async getMyBalance() {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let wallet = store.user.walletAddress
        if (!wallet) {
            return
        }
        let _myBalance = await this.getBalance(wallet)
        await this.dispatch(userRedux.actions.balance_update(_myBalance))
        return await _myBalance
    }

    async getBalance(_address) {
        const store = this.store.getState()
        let methods = store.contract.serc.methods
        return await methods.balanceOf(_address).call()
    }
}
