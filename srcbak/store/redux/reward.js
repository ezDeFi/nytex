import BaseRedux from '@/model/BaseRedux';

class RewardRedux extends BaseRedux {
    defineTypes() {
        return ['reward'];
    }

    defineDefaultState() {
        return {
            loading: false,
            listRound: [],
            listJackpot: [],
            detail: {},
            leaderboard: {},
            topuser: [],
            list: [],
            loading_topuser: false,
            loading_leaderboard: false
        };
    }
}

export default new RewardRedux()
