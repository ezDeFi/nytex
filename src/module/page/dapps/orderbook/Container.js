import {createContainer} from '@/util'
import Component from './Component'
// import ContractService from '@/service/ContractService'
// import DepositService from '@/service/DepositService'
// import RewardService from '@/service/RewardService'
import _ from 'lodash'

import {TASK_CATEGORY, TASK_TYPE} from '@/constant'
import UserService from '@/service/UserService';
import WntyService from '@/service/contracts/wntyService';
import NusdService from '@/service/contracts/nusdService';
import BookService from '@/service/contracts/BookService';

var curWallet
var loadInterval

export default createContainer(Component, (state, ownProps) => {
    const userService = new UserService()
    const wntyService = new WntyService()
    const nusdService = new NusdService()
    const bookService = new BookService()

    async function loadOnInit() {
        // citizenService.getMyUsername()
        //wntyService.getAddress()
        nusdService.getNusdBalance()
        wntyService.getWntyBalance()
        await bookService.getOrders(false)
        await bookService.getOrders(true)
    }

    async function load(isInit) {
        userService.getWalletBalance()
        nusdService.getNusdBalance()
        wntyService.getWntyBalance()
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
        wntyBalance: state.user.wntyBalance,
        nusdBalance: state.user.nusdBalance,
        orders: state.book.orders
    }

}, () => {
    const userService = new UserService()
    const wntyService = new WntyService()
    const nusdService = new NusdService()
    const bookService = new BookService()
    return {
        async sellWNTY(_fromAmount, _toAmount) {
            return wntyService.simpleBuy(_fromAmount, _toAmount)
        },
        async sellNUSD(_fromAmount, _toAmount) {
            return nusdService.simpleBuy(_fromAmount, _toAmount)
        },
        async reload() {
            await bookService.reload()
            await nusdService.getNusdBalance()
            await wntyService.getWntyBalance()
        },
        async remove(_orderType, _id) {
            await bookService.remove(_orderType, _id)
        },
        async transferWNTY(_toWallet, _amount) {
            wntyService.transfer(_toWallet, _amount)
        },
        async transferNUSD(_toWallet, _amount) {
            nusdService.transfer(_toWallet, _amount)
        }
    }
})
