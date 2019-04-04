import BaseRedux from '@/model/BaseRedux';

class DepositRedux extends BaseRedux {
    defineTypes() {
        return ['deposit'];
    }

    defineDefaultState() {
        return {
            loading: false,
            loading_round: false,
            loading_jackpot: false,
            playersRound: [],
            playersJackpot: [],
            detail: {},
            list: []
        };
    }
}

export default new DepositRedux()
