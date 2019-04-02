import BaseService from '../model/BaseService'
import _ from 'lodash'
import {api_request} from '@/util';

export default class extends BaseService {
    async getListRound(param) {
        const rewardRedux = this.store.getRedux('reward')

        const res = await api_request({
            path: '/api/reward/last_round',
            method: 'get'
        })

        await this.dispatch(rewardRedux.actions.listRound_update(res))

        return res
    }

    async getListJackpot(param) {
        const rewardRedux = this.store.getRedux('reward')

        const res = await api_request({
            path: '/api/reward/last_jackpot',
            method: 'get'
        })

        await this.dispatch(rewardRedux.actions.listJackpot_update(res))

        return res
    }

    async getLeaderBoard() {
        const rewardRedux = this.store.getRedux('reward')
        await this.dispatch(rewardRedux.actions.loading_leaderboard_update(true))

        const res = await api_request({
            path: '/api/reward/leaderboard',
            method: 'get'
        })

        await this.dispatch(rewardRedux.actions.loading_leaderboard_update(false))
        await this.dispatch(rewardRedux.actions.leaderboard_update(res))

        return res
    }

    async getLeaderBoardAdmin(params) {
        const rewardRedux = this.store.getRedux('reward')
        await this.dispatch(rewardRedux.actions.topuser_reset())
        await this.dispatch(rewardRedux.actions.loading_topuser_update(true))

        const res = await api_request({
            path: '/api/reward/leaderboardadmin',
            method: 'get',
            data: params
        })

        await this.dispatch(rewardRedux.actions.loading_topuser_update(false))
        await this.dispatch(rewardRedux.actions.topuser_update(res))

        return res
    }

    async getRewardList(params) {
        const rewardRedux = this.store.getRedux('reward')
        await this.dispatch(rewardRedux.actions.loading_update(true))

        const res = await api_request({
            path: '/api/reward/list',
            method: 'get',
            data: params
        })

        await this.dispatch(rewardRedux.actions.loading_update(false))
        await this.dispatch(rewardRedux.actions.list_update(res))

        return res
    }

    async addRewad(params) {
        const res = await api_request({
            path: '/api/reward/create',
            method: 'post',
            data: params
        })

        return res
    }
}
