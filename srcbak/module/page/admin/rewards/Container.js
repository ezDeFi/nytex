import {createContainer} from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import RewardService from '@/service/RewardService'
import { message } from 'antd/lib/index'

export default createContainer(Component, (state) => {

    return {
        user: state.user,
        list: state.reward.list,
        loading: state.reward.loading
    }
}, () => {
    const rewardService = new RewardService()

    return {
        async getRewardList(params) {
            return rewardService.getRewardList(params)
        }
    }
})
