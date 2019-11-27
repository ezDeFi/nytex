import BaseService from '../../model/BaseService'
import _ from 'lodash'

const crypto = require('crypto');

export default class extends BaseService {
    async loadMyStableTokenBalance () {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contracts.stableToken.methods
        let wallet = store.user.wallet
        const exStb = await methods.balanceOf(store.contracts.seigniorage._address).call()
        this.dispatch(userRedux.actions.exStb_update(exStb))
        let stbAllowance = await methods.allowance(wallet, store.contracts.seigniorage._address).call()
        this.dispatch(userRedux.actions.stbAllowance_update(stbAllowance))
        let _stableTokenBalance = await methods.balanceOf(wallet).call()
        await this.dispatch(userRedux.actions.stableTokenBalance_update(_stableTokenBalance))
        return await _stableTokenBalance
    }

    async trade(_haveAmount, _wantAmount) {
        const store = this.store.getState()
        const contract = store.contracts.stableToken;
        const index = '0x' + crypto.randomBytes(32).toString('hex');
        console.log('index = ', index)
        await contract.methods.trade(index, _haveAmount.toString(), _wantAmount.toString(), [0])
            .send({from:store.user.wallet})
    }

    async approve(spender, amount) {
        const store = this.store.getState()
        const contract = store.contracts.stableToken;
        await contract.methods.approve(spender, amount)
            .send({from:store.user.wallet})
    }
}
