import BaseService from '../../model/BaseService'
import _ from 'lodash'

var BigNumber = require('big-number');

export default class extends BaseService {
    async loadMyStableTokenBalance () {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contracts.stableToken.methods
        let wallet = store.user.wallet
        let _stableTokenBalance = await methods.balanceOf(wallet).call()
        await this.dispatch(userRedux.actions.stableTokenBalance_update(_stableTokenBalance))
        return await _stableTokenBalance
    }

    async trade(_haveAmount, _wantAmount) {
        const store = this.store.getState()
        let wallet = store.user.wallet
        let _stableTokenBalance = BigNumber(store.user.stableTokenBalance)
        let _toDeposit = _haveAmount.gt(_stableTokenBalance) ? _haveAmount.subtract(_stableTokenBalance) : 0
        console.log('toDeposit', _toDeposit)
        let methods = store.contracts.stableToken.methods
        let owner = await methods.owner().call()
        await console.log('owner = ', owner)
        console.log('buy MNTY haveA=',_haveAmount.toString(), ' wantA=', _wantAmount.toString())
        await methods.trade(_haveAmount.toString(), _wantAmount.toString(), [0]).send({from: wallet})
    }

    async transfer(_toWallet, _amount) {
        const store = this.store.getState()
        let wallet = store.user.wallet
        let _stableTokenBalance = BigNumber(store.user.stableTokenBalance)
        let _toDeposit = _amount.gt(_stableTokenBalance) ? _amount.subtract(_stableTokenBalance) : 0
        let methods = store.contracts.stableToken.methods
        await methods.transfer(_toWallet, _amount.toString()).send({from: wallet, value: _toDeposit.toString()})
    }
}
