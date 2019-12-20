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
          alert("insufficient NTY")
          throw "insufficient NTY"
        }
        value = value.toString()
      }
      return await volatileTokenService.trade(haveAmount, wantAmount, value)
    },
    async sellStableToken(haveAmount, wantAmount) {
      if (BigInt(haveAmount) > BigInt(this.stableTokenBalance)) {
        alert("insufficient NEWSD")
        throw "insufficient NEWSD"
      }
      return await stableTokenService.trade(haveAmount, wantAmount)
    },
    async deposit(amount) {
      if (BigInt(amount) > BigInt(this.balance)) {
        alert("insufficient native NTY")
        throw "insufficient native NTY"
      }
      return await volatileTokenService.deposit(amount)
    },
    async withdraw(amount) {
      if (BigInt(amount) > BigInt(this.volatileTokenBalance)) {
        alert("insufficient MNTY")
        throw "insufficient MNTY"
      }
      return await volatileTokenService.withdraw(amount)
    },
    // TEST
    async reload() {
      return await seigniorageService.reload()
    }
  }
})
