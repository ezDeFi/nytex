import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import VolatileTokenService from '@/service/contracts/volatileTokenService'
import StableTokenService from '@/service/contracts/stableTokenService'
import SeigniorageService from '@/service/contracts/seigniorageService'
import BigInt from 'big-integer';
var curWallet = null
export default createContainer(Component, (state) => {
  const userService = new UserService()
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService = new StableTokenService()
  const seigniorageService = new SeigniorageService()

  async function loadOnInit() {
    load()
    seigniorageService.loadOrders(true)
    seigniorageService.loadOrders(false)
  }

  async function load() {
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
    cancel(orderType, id) {
      return seigniorageService.cancel(orderType, id)
    },
    sellVolatileToken(haveAmount, wantAmount) {
      const have = BigInt(haveAmount)
      const mnty = BigInt(this.volatileTokenBalance)
      let value = undefined
      if (have > mnty) {
        value = have.minus(mnty)
        if (value > BigInt(this.balance)) {
          throw "insufficient NTY"
        }
        value = value.toString()
      }
      return volatileTokenService.trade(haveAmount, wantAmount, value)
    },
    sellStableToken(haveAmount, wantAmount) {
      if (BigInt(haveAmount) > BigInt(this.stableTokenBalance)) {
        throw "insufficient NEWSD"
      }
      return stableTokenService.trade(haveAmount, wantAmount)
    },
    deposit(amount) {
      if (amount > BigInt(this.balance)) {
        throw "insufficient native NTY"
      }
      return volatileTokenService.deposit(amount.toString())
    },
    withdraw(amount) {
      if (amount > BigInt(this.volatileTokenBalance)) {
        throw "insufficient MNTY"
      }
      return volatileTokenService.withdraw(amount)
    },
    async absorb(amount, sideAbsorbAddress) {
      return await seigniorageService.absorb(amount, sideAbsorbAddress)
    },

    //// DEBUG ////
    newsdTransfer(address, amount) {
      return stableTokenService.transfer(address, amount)
    },
    newsdTransferFrom(from, to, amount) {
      return stableTokenService.transferFrom(from, to, amount)
    },

    // TEST
    reload() {
      return seigniorageService.reload()
    }
  }
})
