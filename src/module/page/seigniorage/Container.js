import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import VolatileTokenService from '@/service/contracts/volatileTokenService'
import StableTokenService from '@/service/contracts/stableTokenService'
import SeigniorageService from '@/service/contracts/seigniorageService'
var curWallet = null
export default createContainer(Component, (state) => {
  const userService = new UserService()
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService = new StableTokenService()
  const seigniorageService = new SeigniorageService()

  async function loadOnInit () {
    load()
    seigniorageService.loadOrders(true)
    seigniorageService.loadOrders(false)
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
    bids: state.seigniorage.bids,
    asks: state.seigniorage.asks,
  }
}, () => {
  const userService = new UserService()
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService = new StableTokenService()
  const seigniorageService = new SeigniorageService()

  return {
    async cancel(orderType, id) {
      return await seigniorageService.cancel(orderType, id)
    },
    async transferVolatileToken(toWallet, amount) {
      return await volatileTokenService.transfer(toWallet, amount)
    },
    async transferStableToken(toWallet, amount) {
      return await stableTokenService.transfer(toWallet, amount)
    },
    async sellVolatileToken(haveAmount, wantAmount) {
      return await volatileTokenService.trade(haveAmount, wantAmount)
    },
    async sellStableToken(haveAmount, wantAmount) {
      return await stableTokenService.trade(haveAmount, wantAmount)
    },
    // TEST
    async reload() {
      return await seigniorageService.reload()
    }
  }
})
