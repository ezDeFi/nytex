import {createContainer} from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import TransactionService from '@/service/TransactionService'
import { message } from 'antd/lib/index'

export default createContainer(Component, (state) => {

    return {
        user: state.user,
        list: state.transaction.list || [],
        loading: state.transaction.loading
    }
}, () => {
    const transactionService = new TransactionService()

    return {
        async getList(params) {
            return transactionService.getList(params)
        }
    }
})
