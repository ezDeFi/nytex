import BaseService from '../../model/BaseService'
import _ from 'lodash'

export default class extends BaseService {
    // Send Fundtions
    register(_rusername, _rRefAddress) {
        const store = this.store.getState()
        let methods = store.contract.citizen.methods
        let wallet = store.user.walletAddress
        return methods.register(_rusername, _rRefAddress).send({from: wallet})
    }

    // Call Functions
    async isCitizen() {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contract.citizen.methods
        let wallet = store.user.walletAddress
        let _isCitizen = await methods.isCitizen(wallet).call()
        await this.dispatch(userRedux.actions.isCitizen_update(_isCitizen))
        return await _isCitizen
    }

    async getUsername(_address) {
        const store = this.store.getState()
        let methods = store.contract.citizen.methods
        return await methods.getUsername(_address).call()
    }

    async getMyUsername() {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let wallet = store.user.walletAddress
        let _username = await this.getUsername(wallet)
        console.log('username', _username)
        await this.dispatch(userRedux.actions.username_update(_username))
        return _username
    }

    async usernameExist(_rusername) {
        const store = this.store.getState()
        let methods = store.contract.citizen.methods
        return await methods.exist(_rusername).call()
    }

    async getRefAddress(_address) {
        const store = this.store.getState()
        let methods = store.contract.citizen.methods
        return await methods.getRef(_address).call()
    }

    async getMyRefAddress() {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let wallet = store.user.walletAddress
        let _ref = await this.getRefAddress(wallet)
        await this.dispatch(userRedux.actions.refAddress_update(await _ref))
        return await _ref
    }

    async getMyRefUsername() {
        const userRedux = this.store.getRedux('user')
        let myRefAddress = await this.getMyRefAddress()
        let _refUsername = await this.getUsername(await myRefAddress)
        console.log(_refUsername)
        await this.dispatch(userRedux.actions.refUsername_update(await _refUsername))
        return await _refUsername
    }
}
