import {createContainer} from "@/util"
import Component from './Component'
import UserService from '@/service/UserService'
import TransactionService from '@/service/TransactionService'
import RewardService from '@/service/RewardService'
import SERCService from '@/service/contracts/SERCService'
import {message} from 'antd'
import {TASK_STATUS} from '@/constant'

export default createContainer(Component, (state) => {

    let page = 'PUBLIC' // default

    if (/^\/admin/.test(state.router.location.pathname)) {
        page = 'ADMIN'
    } else if (/^\/profile/.test(state.router.location.pathname)){
        // TODO: this should be PROFILE
        page = 'LEADER'
    }

    return {
        is_admin: state.user.is_admin,
        is_login: state.user.is_login,
        currentUserId: state.user.current_user_id,
        page: page
    }
}, () => {

    const userService = new UserService()
    const transactionService = new TransactionService()
    const rewardService = new RewardService()
    const sercService = new SERCService()

    return {
        async getMyBalance() {
            try {
                const rs = await sercService.getMyBalance()
            } catch (err) {
                // message.error(err.message)
            }
        },
        async getCurrentUser() {
            try {
                const rs = await userService.getCurrentUser()
            } catch (err) {
                message.error(err.message)
            }
        },
        async withdrawnBalance(userId) {
            try {
                const rs = await transactionService.create(userId)
                if (rs) {
                    message.success('Request withdrawn successfully')
                    this.getCurrentUser()
                }
            } catch (err) {
                message.error(err.message)
            }
        },
        async addRewad(params) {
            try {
                const rs = await rewardService.addRewad(params)
                if (rs) {
                    message.success('Add reward successfully')
                    this.getCurrentUser()
                }
            } catch (err) {
                message.error(err.message)
            }
        },
        async withdraw(amount) {
            try {
                const rs = await sercService.withdraw(amount)
            } catch (err) {
                message.error(err.message)
            }
        }
    }
})
