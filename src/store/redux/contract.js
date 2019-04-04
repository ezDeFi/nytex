import BaseRedux from '@/model/BaseRedux';

class ContractRedux extends BaseRedux {
    defineTypes() {
        return ['contract'];
    }

    defineDefaultState() {
        return {
            loading: false,
            wnty: null,
            nusd: null,
            book: null,
            dapps: {
                simpleDice: null
            },
            lib: {
                web3: null
            },
            owner: null,
            players: [],
            countRound: 0,
            roundTime: 0,
            countJackpot: 0,
            jackpotTime: 0,
            amountRound: 0,
            countPlayerRound: 0,
            amountJackpot: 0,
            countPlayerJackpot: 0,
            connectedMetamask: false,
            isMainnet: false
        };
    }
}

export default new ContractRedux()
