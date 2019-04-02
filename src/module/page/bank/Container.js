import {createContainer} from '@/util'
import Component from './Component'
import ContractService from '@/service/ContractService'
import DepositService from '@/service/DepositService'
import RewardService from '@/service/RewardService'
import _ from 'lodash'

import {TASK_CATEGORY, TASK_TYPE} from '@/constant'
import UserService from '../../../service/UserService';
import CitizenService from '../../../service/contracts/CitizenService';
import SERCService from '../../../service/contracts/SERCService';

export default createContainer(Component, (state, ownProps) => {
    return {
        isCitizen: state.user.isCitizen,
        username: state.user.username,
        wallet: state.user.walletAddress,
        walletBalance: state.user.walletBalance,
        balance: state.user.balance,
        refAddress: state.user.refAddress,
        refUsername: state.user.refUsername
    }

}, () => {
    const userService = new UserService()
    const citizenService = new CitizenService()
    const sercService = new SERCService()
    return {
        // Send
        async register(_rusername, _rRefAddress) {
            return citizenService.register(_rusername, _rRefAddress)
        },
        async deposit(_amount) {
            return sercService.deposit(_amount)
        },
        async withdraw(_amount) {
            return sercService.withdraw(_amount)
        },
        async isCitizen() {
            return citizenService.isCitizen()
        },
        async getMyRefAddress() {
            return citizenService.getMyRefAddress()
        },
        async getMyRefUsername() {
            return citizenService.getMyRefUsername()
        },
        async getWalletBalance() {
            return userService.getWalletBalance()
        },
        async getBalance() {
            return sercService.getMyBalance()
        },
        async usernameExist(_rusername) {
            return citizenService.usernameExist(_rusername)
        }
    }
})
