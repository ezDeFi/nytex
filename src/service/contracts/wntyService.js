import BaseService from '../../model/BaseService'
import _ from 'lodash'

export default class extends BaseService {
    async getWntyBalance() {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contract.wnty.methods
        console.log('methods', methods)
        let wallet = store.user.walletAddress
        let _wntyBalance = await methods.balanceOf(wallet).call()
        console.log('WNTY', await _wntyBalance)
        await this.dispatch(userRedux.actions.wntyBalance_update(_wntyBalance))
        return await _wntyBalance
    }

    async getAddress() {
        const wntyRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        let wntyAddress = store.contract.wnty._address
        console.log('nwty address', wntyAddress)
        await this.dispatch(wntyRedux.actions.address_update(wntyAddress))
        return await diceAddress
    }

    async simpleBuy(_fromAmount, _toAmount) {
        const store = this.store.getState()
        let wallet = store.user.walletAddress
        let _wntyBalance = store.user.wntyBalance
        let _toDeposit = _fromAmount > _wntyBalance ? _fromAmount - _wntyBalance : 0
        console.log('_toDeposit', _toDeposit)
        let methods = store.contract.wnty.methods
        await methods.simpleBuy(_fromAmount, _toAmount, [0]).send({from: wallet, value: _toDeposit})
    }

    async transfer(_toWallet, _amount) {
        const store = this.store.getState()
        let wallet = store.user.walletAddress
        let _wntyBalance = store.user.wntyBalance
        let _toDeposit = _amount > _wntyBalance ? _amount - _wntyBalance : 0
        let methods = store.contract.wnty.methods
        await methods.transfer(_toWallet, _amount).send({from: wallet, value: _toDeposit})
    }
}