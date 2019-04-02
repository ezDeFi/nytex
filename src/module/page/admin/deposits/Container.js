import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import DepositService from '@/service/DepositService'
import { message } from 'antd/lib/index'
import _ from 'lodash'

export default createContainer(Component, (state) => {

    return {
        loading: state.member.users_loading,
        is_admin: state.user.is_admin,
        list: state.deposit.list || [],
        loading_deposit: state.deposit.loading
    }
}, () => {
    const depositService = new DepositService()

    return {
        async getDepositList(params) {
            return depositService.getDepositList(params)
        }
    }
})
