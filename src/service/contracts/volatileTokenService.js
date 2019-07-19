import BaseService from '../../model/BaseService'
import web3 from 'web3'
import _ from 'lodash'

var BigNumber = require('big-number');

export default class extends BaseService {
    async loadMyVolatileTokenBalance () {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contracts.volatileToken.methods
        let wallet = store.user.wallet
        let _volatileTokenBalance = await methods.balanceOf(wallet).call()
        await this.dispatch(userRedux.actions.volatileTokenBalance_update(_volatileTokenBalance))
        return await _volatileTokenBalance
    }

    async propose(stake, amount, slashingDuration, lockdownExpiration) {
        const store = this.store.getState()
        let wallet = store.user.wallet
        let methods = store.contracts.volatileToken.methods
        // console.log('sell MNTY haveA=',_haveAmount.toString(), ' wantA=', _wantAmount.toString())
        await methods.propose(stake.toString(), amount.toString(), slashingDuration, lockdownExpiration).
            send({from: wallet, value: 0})
    }

    async trade(_haveAmount, _wantAmount) {
        const store = this.store.getState()
        let wallet = store.user.wallet
        let _volatileTokenBalance = BigNumber(store.user.volatileTokenBalance)
        let _toDeposit = _haveAmount.gt(_volatileTokenBalance) ? _haveAmount.subtract(_volatileTokenBalance) : 0
        let methods = store.contracts.volatileToken.methods
        // console.log('sell MNTY haveA=',_haveAmount.toString(), ' wantA=', _wantAmount.toString())
        await methods.trade(_haveAmount.toString(), _wantAmount.toString(), [0]).send({from: wallet, value: _toDeposit.toString()})
    }

    async transfer(_toWallet, _amount) {
        const store = this.store.getState()
        let wallet = store.user.wallet
        let _volatileTokenBalance = BigNumber(store.user.volatileTokenBalance)
        let _toDeposit = _amount.gt(_volatileTokenBalance) ? _amount.subtract(_volatileTokenBalance) : 0
        let methods = store.contracts.volatileToken.methods
        await methods.transfer(_toWallet, _amount.toString()).send({from: wallet, value: _toDeposit.toString()})
    }
}