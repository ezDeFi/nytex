import {createContainer} from '@/util'
import Component from './Component'
import ContractService from '@/service/ContractService'
import DepositService from '@/service/DepositService'
import RewardService from '@/service/RewardService'
import _ from 'lodash'

import {TASK_CATEGORY, TASK_TYPE} from '@/constant'
import UserService from '@/service/UserService';
import CitizenService from '@/service/contracts/CitizenService';
import SERCService from '@/service/contracts/SERCService';
import SimpleDiceService from '@/service/contracts/SimpleDiceService';

var curWallet
var loadInterval

export default createContainer(Component, (state, ownProps) => {
    const userService = new UserService()
    const citizenService = new CitizenService()
    const sercService = new SERCService()
    const simpleDiceService = new SimpleDiceService()

    async function loadOnInit() {
        // citizenService.getMyUsername()
        citizenService.isCitizen()
        citizenService.getMyRefAddress()
        citizenService.getMyRefUsername()

        simpleDiceService.getAddress()
        simpleDiceService.getCurRoundId()
    }

    async function load(isInit) {
        let pause = await simpleDiceService.getPause()
        userService.getWalletBalance()
        simpleDiceService.getWinTeam()
        simpleDiceService.getFinalized()

        if (pause && !isInit) {
            console.log('pause')
            return
        }
        simpleDiceService.getKeyBlock()
        simpleDiceService.getEndTime()
        simpleDiceService.getCurRoundId()
        simpleDiceService.getBetSum()
        simpleDiceService.getBetLeng()
        simpleDiceService.loadFullBets()
        simpleDiceService.getStarted()
        simpleDiceService.getLocked()
        simpleDiceService.getWinTeam()
    }

    // init
    if (curWallet !== state.user.walletAddress) {
        curWallet = state.user.walletAddress
        loadOnInit()
        load(true)
        setInterval(() => {
            load(false)
        }, 3000)
    }
    return {
        isCitizen: state.user.isCitizen,
        username: state.user.username,
        wallet: state.user.walletAddress,
        walletBalance: state.user.walletBalance,
        balance: state.user.balance,
        refAddress: state.user.refAddress,
        refUsername: state.user.refUsername,
        // dice info
        address: state.simpleDice.address,
        curRoundId: state.simpleDice.curRoundId,
        MAX_LIMIT: state.simpleDice.MAX_LIMIT,
        bets: state.simpleDice.bets,
        betSum: state.simpleDice.betSum,
        betLength: state.simpleDice.betLength,
        loadedTo: state.simpleDice.loadedTo,
        keyBlock: state.simpleDice.keyBlock,
        endTime: state.simpleDice.endTime,
        started: state.simpleDice.started,
        locked: state.simpleDice.locked,
        finalized: state.simpleDice.finalized,
        winTeam: state.simpleDice.winTeam,
        fund: state.simpleDice.fund,
        devTeam: state.simpleDice.devTeam,
        playersTails: state.simpleDice.playersTails,
        playersHeads: state.simpleDice.playersHeads
    }

}, () => {
    const userService = new UserService()
    const citizenService = new CitizenService()
    const sercService = new SERCService()
    const simpleDiceService = new SimpleDiceService()
    return {
        // citizen
        async register(_rusername, _rRefAddress) {
            return citizenService.register(_rusername, _rRefAddress)
        },

        async usernameExist(_rusername) {
            return citizenService.usernameExist(_rusername)
        },

        async getUsername(_address) {
            return await citizenService.getUsername(_address)
        },

        // SERC
        async deposit(_amount) {
            return sercService.deposit(_amount)
        },
        async withdraw(_amount) {
            return sercService.withdraw(_amount)
        },

        // simpleDice
        async bet(_team, _amount) {
            simpleDiceService.bet(_team, _amount)
        },
        async endRound() {
            simpleDiceService.endRound()
        },
        async forcedEndRound() {
            simpleDiceService.forcedEndRound()
        },
        async playagain() {
            simpleDiceService.playagain()
        },
        toggleRegisterModal(toggle) {
            userService.toggleRegisterModal(toggle)
        },
    }
})
