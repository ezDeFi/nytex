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
      const mnty = BigInt(this.volatileTokenBalance)
      let value = undefined
      if (have > mnty) {
        value = (have - mnty)
        if (value > BigInt(this.balance)) {
          throw "insufficient balance"
        }
        value = value.toString()
      }
      return await volatileTokenService.trade(haveAmount, wantAmount, value)
    },
    async sellStableToken(haveAmount, wantAmount) {
      if (BigInt(haveAmount) > BigInt(this.stableTokenBalance)) {
        throw "insufficient balance"
      }
      return await stableTokenService.trade(haveAmount, wantAmount)
    },
    async deposit(amount) {
      if (BigInt(amount) > BigInt(this.balance)) {
        throw "insufficient balance"
      }
      return await volatileTokenService.deposit(amount)
    },
    async withdraw(amount) {
      if (BigInt(amount) > BigInt(this.volatileTokenBalance)) {
        throw "insufficient balance"
      }
      return await volatileTokenService.withdraw(amount)
    },
    async absorb(amount, sideAbsorbAddress) {
      return await seigniorageService.absorb(amount, sideAbsorbAddress)
    },
    // TEST
    async reload() {
      return await seigniorageService.reload()
    }
  }
})
