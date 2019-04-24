import {createContainer} from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import TransactionService from '@/service/TransactionService'
import {Message} from 'antd'

export default createContainer(Component, (state) => {
    return {
        loading: state.member.loading,
        member: state.member.detail,
        transaction: state.transaction.detail
    }
}, () => {
    const transactionService = new TransactionService()

    return {
        async getTransaction(transactionId) {
            return transactionService.get(transactionId)
        },
        async approveTransaction(params) {
            try {
                const rs = await transactionService.approve(params)
                if (rs) {
                    Message.success('Approve transaction successfully')
                    this.getTransaction(params.transactionId)
                }
            } catch (err) {
                Message.error(err.message)
            }
        },
        async rejectTransaction(params) {
            try {
                const rs = await transactionService.reject(params)
                if (rs) {
                    Message.success('Reject transaction successfully')
                    this.getTransaction(params.transactionId)
                }
            } catch (err) {
                Message.error(err.message)
            }
        }
    }
})
