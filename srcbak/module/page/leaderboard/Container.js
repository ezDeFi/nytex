import {createContainer} from '@/util'
import Component from './Component'
import RewardService from '@/service/RewardService'
import _ from 'lodash'

import {TASK_CATEGORY, TASK_TYPE} from '@/constant'

export default createContainer(Component, (state, ownProps) => {
    if (!_.isArray(state.reward.leaderboard.rankDayly)) {
        state.reward.leaderboard.rankDayly = _.values(state.reward.leaderboard.rankDayly);
    }
    if (!_.isArray(state.reward.leaderboard.rankWeekly)) {
        state.reward.leaderboard.rankWeekly = _.values(state.reward.leaderboard.rankWeekly);
    }
    if (!_.isArray(state.reward.leaderboard.rankMonthly)) {
        state.reward.leaderboard.rankMonthly = _.values(state.reward.leaderboard.rankMonthly);
    }

    return {
        rankDayly: state.reward.leaderboard.rankDayly,
        rankWeekly: state.reward.leaderboard.rankWeekly,
        rankMonthly: state.reward.leaderboard.rankMonthly,
        dateDayly: state.reward.leaderboard.dateDayly,
        dateWeekly: state.reward.leaderboard.dateWeekly,
        dateMonthly: state.reward.leaderboard.dateMonthly,
        rankPoolAmount: state.reward.leaderboard.rankPoolAmount,
        loading: state.reward.loading_leaderboard
    }

}, () => {
    const rewardService = new RewardService()

    return {
        async getLeaderBoard() {
            return rewardService.getLeaderBoard()
        }
    }
})
