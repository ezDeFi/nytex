import {createContainer} from '@/util'
import Component from './Component'
// import ContractService from '@/service/ContractService'
// import DepositService from '@/service/DepositService'
// import RewardService from '@/service/RewardService'
import _ from 'lodash'

import {TASK_CATEGORY, TASK_TYPE} from '@/constant'
import UserService from '@/service/UserService';
import WntyService from '@/service/contracts/volatileTokenService';
import NusdService from '@/service/contracts/stableTokenService';
import BookService from '@/service/contracts/BookService';

var curWallet
var loadInterval

export default createContainer(Component, (state, ownProps) => {
    const userService = new UserService()
    const volatileTokenService = new WntyService()
    const stableTokenService = new NusdService()
    const bookService = new BookService()

    async function loadOnInit() {
        // citizenService.getMyUsername()
        //volatileTokenService.getAddress()
        stableTokenService.getNusdBalance()
        volatileTokenService.getWntyBalance()
        await bookService.getOrders(false)
        await bookService.getOrders(true)
    }

    async function load(isInit) {
        userService.getWalletBalance()
        stableTokenService.getNusdBalance()
        volatileTokenService.getWntyBalance()
        //console.log("wallet", state.user.walletAddress)
    }
    // init
    if (curWallet !== state.user.walletAddress) {
        console.log('wallet', state.user.walletAddress)
        curWallet = state.user.walletAddress
        loadOnInit()
        load(true)
        setInterval(() => {
            //load(false)
        }, 6000)
    }
    return {
        wallet: state.user.walletAddress,
        volatileTokenBalance: state.user.volatileTokenBalance,
        stableTokenBalance: state.user.stableTokenBalance,
        orders: state.book.orders
    }

}, () => {
    const userService = new UserService()
    const volatileTokenService = new WntyService()
    const stableTokenService = new NusdService()
    const bookService = new BookService()
    return {
        async sellVolatileToken(_fromAmount, _toAmount) {
            return volatileTokenService.simpleBuy(_fromAmount, _toAmount)
        },
        async sellStableToken(_fromAmount, _toAmount) {
            return stableTokenService.simpleBuy(_fromAmount, _toAmount)
        },
        async reload() {
            await bookService.reload()
            await stableTokenService.getNusdBalance()
            await volatileTokenService.getWntyBalance()
        },
        async remove(_orderType, _id) {
            await bookService.remove(_orderType, _id)
        },
        async transferVolatileToken(_toWallet, _amount) {
            volatileTokenService.transfer(_toWallet, _amount)
        },
        async transferStableToken(_toWallet, _amount) {
            stableTokenService.transfer(_toWallet, _amount)
        }
    }
})
