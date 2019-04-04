import BaseService from '../../model/BaseService'
import _ from 'lodash'

export default class extends BaseService {
    async getWntyBalance() {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contract.volatileToken.methods
        console.log('methods', methods)
        let wallet = store.user.walletAddress
        let _volatileTokenBalance = await methods.balanceOf(wallet).call()
        console.log('VolatileToken', await _volatileTokenBalance)
        await this.dispatch(userRedux.actions.volatileTokenBalance_update(_volatileTokenBalance))
        return await _volatileTokenBalance
    }

    async getAddress() {
        const volatileTokenRedux = this.store.getRedux('simpleDice')
        const store = this.store.getState()
        let volatileTokenAddress = store.contract.volatileToken._address
        console.log('nwty address', volatileTokenAddress)
        await this.dispatch(volatileTokenRedux.actions.address_update(volatileTokenAddress))
        return await diceAddress
    }

    async simpleBuy(_fromAmount, _toAmount) {
        const store = this.store.getState()
        let wallet = store.user.walletAddress
        let _volatileTokenBalance = store.user.volatileTokenBalance
        let _toDeposit = _fromAmount > _volatileTokenBalance ? _fromAmount - _volatileTokenBalance : 0
        console.log('_toDeposit', _toDeposit)
        let methods = store.contract.volatileToken.methods
        await methods.simpleBuy(_fromAmount, _toAmount, [0]).send({from: wallet, value: _toDeposit})
    }

    async transfer(_toWallet, _amount) {
        const store = this.store.getState()
        let wallet = store.user.walletAddress
        let _volatileTokenBalance = store.user.volatileTokenBalance
        let _toDeposit = _amount > _volatileTokenBalance ? _amount - _volatileTokenBalance : 0
        let methods = store.contract.volatileToken.methods
        await methods.transfer(_toWallet, _amount).send({from: wallet, value: _toDeposit})
    }
}