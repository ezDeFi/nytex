import BaseService from '../../model/BaseService'
import _ from 'lodash'

const BigNumber = require('big-number');
const crypto = require('crypto');

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
        // let _toDeposit = _haveAmount.gt(_stableTokenBalance) ? _haveAmount.subtract(_stableTokenBalance) : 0
        // console.log('toDeposit', _toDeposit)
        let methods = store.contracts.stableToken.methods
        let owner = await methods.owner().call()
        await console.log('owner = ', owner)
        console.log('buy MNTY haveA=',_haveAmount.toString(), ' wantA=', _wantAmount.toString())
        const index = '0x' + crypto.randomBytes(32).toString('hex');
        console.log('index = ', index)
        await methods.trade(index, _haveAmount.toString(), _wantAmount.toString(), [0]).send({from: wallet})
    }

    async approve(spender, amount) {
        const store = this.store.getState()
        const wallet = store.user.wallet
        const methods = store.contracts.stableToken.methods
        await methods.approve(spender, amount).send({from: wallet})
    }

    // async transfer(_toWallet, _amount) {
    //     const store = this.store.getState()
    //     let wallet = store.user.wallet
    //     let _stableTokenBalance = BigNumber(store.user.stableTokenBalance)
    //     let _toDeposit = _amount.gt(_stableTokenBalance) ? _amount.subtract(_stableTokenBalance) : 0
    //     let methods = store.contracts.stableToken.methods
    //     await methods.transfer(_toWallet, _amount.toString()).send({from: wallet, value: _toDeposit.toString()})
    // }

    async loadStableTokenAllowance () {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contracts.stableToken.methods
        let spender = '0x0000000000000000000000000000000000023456'
        let wallet = store.user.wallet
        let _stableTokenAllowance = await methods.allowance(wallet, spender).call()
        await this.dispatch(userRedux.actions.stableTokenAllowance_update(_stableTokenAllowance))
        return await _stableTokenAllowance
    }
}
