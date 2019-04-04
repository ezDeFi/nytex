import BaseService from '../model/BaseService'
import _ from 'lodash'
import {api_request} from '@/util';

export default class extends BaseService {
    async getList(param) {
        const transactionRedux = this.store.getRedux('transaction')
        await this.dispatch(transactionRedux.actions.list_update([]))
        await this.dispatch(transactionRedux.actions.loading_update(true))

        const res = await api_request({
            path: '/api/transaction/list',
            method: 'get',
            data: param
        })

        await this.dispatch(transactionRedux.actions.list_update(res))
        await this.dispatch(transactionRedux.actions.loading_update(false))
        return res
    }

    async get(transactionId) {
        const transactionRedux = this.store.getRedux('transaction')
        await this.dispatch(transactionRedux.actions.detail_reset())

        const res = await api_request({
            path: `/api/transaction/${transactionId}`,
            method: 'get'
        })

        await this.dispatch(transactionRedux.actions.detail_update(res))
        return res
    }

    async create(userId) {
        const res = await api_request({
            path: `/api/transaction/create`,
            method: 'post',
            data: {
                userId: userId
            }
        })

        return res
    }

    async approve(params) {
        const res = await api_request({
            path: `/api/transaction/approve`,
            method: 'put',
            data: params
        })

        return res
    }

    async reject(params) {
        const res = await api_request({
            path: `/api/transaction/reject`,
            method: 'put',
            data: params
        })

        return res
    }
}
