import BaseService from '../../model/BaseService'
import _ from 'lodash'
import { truncateShift, thousands, weiToMNTY, weiToNUSD } from '@/util/help'

const crypto = require('crypto');

export default class extends BaseService {
    loadMyVolatileTokenBalance () {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contracts.volatileToken.methods
        let wallet = store.user.wallet
        methods.totalInflated().call().then(inflated => {
            this.dispatch(userRedux.actions.inflated_update(inflated))
        })
        methods.balanceOf(store.contracts.seigniorage._address).call().then(exVol => {
            this.dispatch(userRedux.actions.exVol_update(exVol))
        })
        methods.allowance(wallet, store.contracts.seigniorage._address).call().then(volAllowance => {
            this.dispatch(userRedux.actions.volAllowance_update(volAllowance))
        })
        methods.balanceOf(wallet).call().then(_volatileTokenBalance => {
            this.dispatch(userRedux.actions.volatileTokenBalance_update(_volatileTokenBalance))
        })
    }

    async deposit(amount) {
        const store = this.store.getState()
        const contract = store.contracts.volatileToken
        await contract.methods.deposit()
            .send({from: store.user.wallet, value: amount})
    }

    async propose(amount, stake, slashingRate, lockdownExpiration, value) {
        slashingRate = truncateShift(slashingRate, 3);
        console.log('propose', thousands(weiToNUSD(amount)), thousands(weiToMNTY(stake)), slashingRate, lockdownExpiration);
        const store = this.store.getState()
        const contract = store.contracts.volatileToken;
        let propose = contract.methods.propose
        const sendOpts = {from:store.user.wallet}
        if (value !== undefined) {
            sendOpts.value = value
            propose = contract.methods.depositAndPropose
        }
        await propose(amount, stake, slashingRate, lockdownExpiration).send(sendOpts)
    }

    async trade(_haveAmount, _wantAmount, value) {
        const store = this.store.getState()
        const contract = store.contracts.volatileToken;
        const index = '0x' + crypto.randomBytes(32).toString('hex');
        console.log('index = ', index)
        const sendOpts = {from:store.user.wallet}
        let trade = contract.methods.trade
        if (value !== undefined) {
            sendOpts.value = value
            trade = contract.methods.depositAndTrade
        }
        await trade(index, _haveAmount.toString(), _wantAmount.toString(), [0]).send(sendOpts)
    }

    async withdraw(amount) {
        const store = this.store.getState()
        const contract = store.contracts.volatileToken
        await contract.methods.withdraw(amount)
            .send({from: store.user.wallet})
    }

    async approve(spender, amount) {
        const store = this.store.getState()
        const contract = store.contracts.volatileToken;
        await contract.methods.approve(spender, amount)
            .send({from:store.user.wallet})
    }
}