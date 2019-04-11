import BaseRedux from '@/model/BaseRedux';

class SimpleDiceRedux extends BaseRedux {
    defineTypes() {
        return ['simpleDice'];
    }

    defineDefaultState() {
        return {
            pause: false,
            address: null,
            curRoundId: null,
            MAX_LIMIT: 88888888888,
            bets: {true: [], false: []},
            betSum: {true: 0, false: 0},
            betLength: {true: 0, false: 0},
            loadedTo: {true: 0, false: 0},
            teamLoading: false,
            keyBlock: null,
            endTime: null,
            started: null,
            locked: null,
            finalized: null,
            winTeam: null,
            fund: 0,
            devTeam: null,
            playersTails: 0,
            playersHeads: 0
        };
    }
}

export default new SimpleDiceRedux()
