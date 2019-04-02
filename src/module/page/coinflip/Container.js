import {createContainer} from '@/util'
import Component from './Component'
import RewardService from '@/service/RewardService'
import _ from 'lodash'

import {TASK_CATEGORY, TASK_TYPE} from '@/constant'

export default createContainer(Component, (state, ownProps) => {

    return {
    }

}, () => {
    const rewardService = new RewardService()

    return {
        async getLeaderBoard() {
            return rewardService.getLeaderBoard()
        }
    }
})
