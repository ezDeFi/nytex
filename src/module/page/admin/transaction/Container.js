import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import TransactionService from '@/service/TransactionService'
import { message } from 'antd/lib/index'
import _ from 'lodash'

export default createContainer(Component, (state) => {

    return {
        loading: state.member.users_loading,
        is_admin: state.user.is_admin,
        list: state.transaction.list || [],
        loading_transaction: state.transaction.loading
    }
}, () => {
    const transactionService = new TransactionService()

    return {
        async getList(params) {
            return transactionService.getList(params)
        }
    }
})
