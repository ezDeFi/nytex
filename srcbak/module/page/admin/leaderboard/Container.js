import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import RewardService from '@/service/RewardService'
import { message } from 'antd/lib/index'
import _ from 'lodash'

export default createContainer(Component, (state) => {

    return {
        loading: state.reward.loading_topuser,
        is_admin: state.user.is_admin,
        list: state.reward.topuser || []
    }
}, () => {
    const rewardService = new RewardService()

    return {
        async getLeaderBoardAdmin(params) {
            return rewardService.getLeaderBoardAdmin(params)
        }
    }
})
