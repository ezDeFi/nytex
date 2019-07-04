import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import VolatileTokenService from '@/service/contracts/volatileTokenService'
import StableTokenService from '@/service/contracts/stableTokenService'
import PairExService from '@/service/contracts/pairExService'
var curWallet = null
export default createContainer(Component, (state) => {
  const userService = new UserService()
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService = new StableTokenService()
  const pairExService = new PairExService()

  async function loadOnInit () {
    load()
    pairExService.loadOrders(true)
    pairExService.loadOrders(false)
  }

  async function load () {
    userService.loadBlockNumber()
    userService.getBalance()

    volatileTokenService.loadMyVolatileTokenBalance()
    stableTokenService.loadMyStableTokenBalance()
  }

  if (state.user.wallet !== curWallet && !curWallet) {
    curWallet = state.user.wallet
    loadOnInit()
    setInterval(() => {
      load()
    }, 5000)
  }

  return {
    wallet: state.user.wallet,
    balance: state.user.balance,
    volatileTokenBalance: state.user.volatileTokenBalance,
    stableTokenBalance: state.user.stableTokenBalance,
    orders: state.pairEx.orders
  }
}, () => {
  const userService = new UserService()
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService = new StableTokenService()
  const pairExService = new PairExService()

  return {
    async transferVolatileToken(toWallet, amount) {
      volatileTokenService.transfer(toWallet, amount)
    },
    async transferStableToken(toWallet, amount) {
      stableTokenService.transfer(toWallet, amount)
    },
    async sellVolatileToken(haveAmount, wantAmount) {
      return await volatileTokenService.trade(haveAmount, wantAmount)
    },
    async sellStableToken(haveAmount, wantAmount) {
      return await stableTokenService.trade(haveAmount, wantAmount)
    },
    // TEST
    async reload() {
      return await pairExService.reload()
    }
  }
})
