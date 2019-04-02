import {createContainer} from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import DepositService from '@/service/DepositService'
import { message } from 'antd/lib/index'

export default createContainer(Component, (state) => {

    return {
        user: state.user,
        list: state.deposit.list,
        loading: state.deposit.loading
    }
}, () => {
    const depositService = new DepositService()

    return {
        async getDepositList(params) {
            return depositService.getDepositList(params)
        }
    }
})
