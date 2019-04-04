import BaseService from '../../model/BaseService'
import _ from 'lodash'

export default class extends BaseService {
    async getNusdBalance() {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contract.stableToken.methods
        let wallet = store.user.walletAddress
        let _stableTokenBalance = await methods.balanceOf(wallet).call()
        await console.log('StableToken balance', await _stableTokenBalance)
        await this.dispatch(userRedux.actions.stableTokenBalance_update(_stableTokenBalance))
        return await _stableTokenBalance
    }

    async simpleBuy(_fromAmount, _toAmount) {
        const store = this.store.getState()
        let wallet = store.user.walletAddress
        let _stableTokenBalance = store.user.stableTokenBalance
        let _toDeposit = _fromAmount > _stableTokenBalance ? _fromAmount - _stableTokenBalance : 0
        console.log('_toDeposit', _toDeposit)
        let methods = store.contract.stableToken.methods
        await methods.simpleBuy(_fromAmount, _toAmount, [0]).send({from: wallet, value: _toDeposit})
    }

    async transfer(_toWallet, _amount) {
        const store = this.store.getState()
        let wallet = store.user.walletAddress
        let methods = store.contract.stableToken.methods
        await methods.transfer(_toWallet, _amount).send({from: wallet})
    }
}
