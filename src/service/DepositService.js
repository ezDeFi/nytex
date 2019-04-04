import BaseService from '../model/BaseService'
import _ from 'lodash'
import {api_request} from '@/util';

export default class extends BaseService {
    async getPlayersRound() {
        const depositRedux = this.store.getRedux('deposit')
        await this.dispatch(depositRedux.actions.loading_round_update(true))

        const res = await api_request({
            path: '/api/deposit/current_round',
            method: 'get'
        })

        await this.dispatch(depositRedux.actions.loading_round_update(false))
        await this.dispatch(depositRedux.actions.playersRound_update(res))

        return res
    }

    async getPlayersJackpot() {
        const depositRedux = this.store.getRedux('deposit')
        await this.dispatch(depositRedux.actions.loading_jackpot_update(true))

        const res = await api_request({
            path: '/api/deposit/current_jackpot',
            method: 'get'
        })

        await this.dispatch(depositRedux.actions.loading_jackpot_update(false))
        await this.dispatch(depositRedux.actions.playersJackpot_update(res))

        return res
    }

    async getDepositList(params) {
        const depositRedux = this.store.getRedux('deposit')
        await this.dispatch(depositRedux.actions.loading_update(true))

        const res = await api_request({
            path: '/api/deposit/list',
            method: 'get',
            data: params
        })

        await this.dispatch(depositRedux.actions.loading_update(false))
        await this.dispatch(depositRedux.actions.list_update(res))

        return res
    }
}
