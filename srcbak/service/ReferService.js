import BaseService from '../model/BaseService'
import _ from 'lodash'
import {api_request} from '@/util';

export default class extends BaseService {
    async getList(param) {
        const referRedux = this.store.getRedux('refer')
        await this.dispatch(referRedux.actions.list_update([]))
        await this.dispatch(referRedux.actions.loading_update(true))

        const res = await api_request({
            path: '/api/refer/list',
            method: 'get',
            data: param
        })

        await this.dispatch(referRedux.actions.loading_update(false))
        await this.dispatch(referRedux.actions.list_update(res))

        return res
    }
}
