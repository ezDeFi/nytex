import BaseService from '../../model/BaseService'
import _ from 'lodash'

export default class extends BaseService {
    async getNusdBalance() {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contract.nusd.methods
        let wallet = store.user.walletAddress
        let _nusdBalance = await methods.balanceOf(wallet).call()
        await console.log('StableToken balance', await _nusdBalance)
        await this.dispatch(userRedux.actions.nusdBalance_update(_nusdBalance))
        return await _nusdBalance
    }

    async simpleBuy(_fromAmount, _toAmount) {
        const store = this.store.getState()
        let wallet = store.user.walletAddress
        let _nusdBalance = store.user.nusdBalance
        let _toDeposit = _fromAmount > _nusdBalance ? _fromAmount - _nusdBalance : 0
        console.log('_toDeposit', _toDeposit)
        let methods = store.contract.nusd.methods
        await methods.simpleBuy(_fromAmount, _toAmount, [0]).send({from: wallet, value: _toDeposit})
    }

    async transfer(_toWallet, _amount) {
        const store = this.store.getState()
        let wallet = store.user.walletAddress
        let methods = store.contract.nusd.methods
        await methods.transfer(_toWallet, _amount).send({from: wallet})
    }
}
