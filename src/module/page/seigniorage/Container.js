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
    volAllowance: state.user.volAllowance,
    stbAllowance: state.user.stbAllowance,
    bids: state.seigniorage.bids,
    asks: state.seigniorage.asks,
    inflated: state.user.inflated,
    exVol: state.user.exVol,
    exStb: state.user.exStb,
  }
}, () => {
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService = new StableTokenService()
  const seigniorageService = new SeigniorageService()

  return {
    async cancel(orderType, id) {
      return await seigniorageService.cancel(orderType, id)
    },
    async sellVolatileToken(haveAmount, wantAmount) {
      const have = BigInt(haveAmount)
      const balance = BigInt(this.volatileTokenBalance)
      let value = undefined
      if (have > balance) {
        value = (have - balance).toString()
      }
      return await volatileTokenService.trade(haveAmount, wantAmount, value)
    },
    async sellStableToken(haveAmount, wantAmount) {
      return await stableTokenService.trade(haveAmount, wantAmount)
    },
    async deposit(amount) {
      return await volatileTokenService.deposit(amount)
    },
    async withdraw(amount) {
      return await volatileTokenService.withdraw(amount)
    },
    async absorb(amount, sideAbsorbAddress) {
      return await seigniorageService.absorb(amount, sideAbsorbAddress)
    },
    async approve(spender, amount, isVolatile) {
      if (isVolatile) {
        return await volatileTokenService.approve(spender, amount) 
      } else {
        return await stableTokenService.approve(spender, amount)
      } 
    },
    // TEST
    async reload() {
      return await seigniorageService.reload()
    }
  }
})
