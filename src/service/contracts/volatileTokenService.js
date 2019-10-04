import BaseService from '../../model/BaseService'
import web3 from 'web3'
import _ from 'lodash'

const BigNumber = require('big-number');
const crypto = require('crypto');

export default class extends BaseService {
    async loadMyVolatileTokenBalance () {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contracts.volatileToken.methods
        let wallet = store.user.wallet
        const inflated = await methods.totalInflated().call()
        this.dispatch(userRedux.actions.inflated_update(inflated))
        let _volatileTokenBalance = await methods.balanceOf(wallet).call()
        await this.dispatch(userRedux.actions.volatileTokenBalance_update(_volatileTokenBalance))
        return await _volatileTokenBalance
    }

    async propose(amount, stake, slashingDuration, lockdownExpiration) {
        const store = this.store.getState()
        let wallet = store.user.wallet
        let methods = store.contracts.volatileToken.methods
        // console.log('sell MNTY haveA=',_haveAmount.toString(), ' wantA=', _wantAmount.toString())
        await methods.propose(amount, stake, slashingDuration, lockdownExpiration).
            send({from: wallet, value: 0})
    }

    async trade(_haveAmount, _wantAmount) {
        const store = this.store.getState()
        let wallet = store.user.wallet
        // let _volatileTokenBalance = BigNumber(store.user.volatileTokenBalance)
        // let _toDeposit = _haveAmount.gt(_volatileTokenBalance) ? _haveAmount.subtract(_volatileTokenBalance) : 0
        let methods = store.contracts.volatileToken.methods
        // console.log('sell MNTY haveA=',_haveAmount.toString(), ' wantA=', _wantAmount.toString())
        const index = '0x' + crypto.randomBytes(32).toString('hex');
        console.log('index = ', index)
        await methods.trade(index, _haveAmount.toString(), _wantAmount.toString(), [0]).send({from: wallet/*, value: _toDeposit.toString()*/})
    }

    // async transfer(_toWallet, _amount) {
    //     const store = this.store.getState()
    //     let wallet = store.user.wallet
    //     let _volatileTokenBalance = BigNumber(store.user.volatileTokenBalance)
    //     let _toDeposit = _amount.gt(_volatileTokenBalance) ? _amount.subtract(_volatileTokenBalance) : 0
    //     let methods = store.contracts.volatileToken.methods
    //     await methods.transfer(_toWallet, _amount.toString()).send({from: wallet, value: _toDeposit.toString()})
    // }

    async deposit(amount) {
        const store = this.store.getState()
        const wallet = store.user.wallet
        const methods = store.contracts.volatileToken.methods
        await methods.deposit().send({from: wallet, value: amount})
    }

    async withdraw(_amount) {
        const store = this.store.getState()
        const wallet = store.user.wallet
        const methods = store.contracts.volatileToken.methods
        await methods.withdraw(_amount).send({from: wallet})
    }

    async approve(spender, amount) {
        const store = this.store.getState()
        const wallet = store.user.wallet
        const methods = store.contracts.volatileToken.methods
        await methods.approve(spender, amount).send({from: wallet})
    }
    
    async loadVolatileTokenAllowance () {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contracts.volatileToken.methods
        let wallet = store.user.wallet
        let spender = '0x0000000000000000000000000000000000023456'
        const inflated = await methods.totalInflated().call()
        this.dispatch(userRedux.actions.inflated_update(inflated))
        let _volatileTokenAllowance = await methods.allowance(wallet, spender).call()
        await this.dispatch(userRedux.actions.volatileTokenAllowance_update(_volatileTokenAllowance))
        return await _volatileTokenAllowance
    }
}