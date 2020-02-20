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
    seigniorageService.loadProposals()
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
    globalParams: state.seigniorage.globalParams,
    lockdown: state.seigniorage.lockdown,
    proposals: state.seigniorage.proposals
  }
}, () => {
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService = new StableTokenService()
  const seigniorageService = new SeigniorageService()

  return {
    propose(amount, stake, slashingRate, lockdownExpiration) {
      const have = BigInt(stake)
      const mnty = BigInt(this.volatileTokenBalance)
      let value = undefined
      if (have > mnty) {
        value = (have - mnty)
        if (value > BigInt(this.balance)) {
          throw "insufficient fund to stake"
        }
        value = value.toString()
      }
      return volatileTokenService.propose(amount, stake, slashingRate, lockdownExpiration, value)
    },
    revoke(maker) {
      return seigniorageService.revoke(maker)
    },
    vote(maker, up) {
      return seigniorageService.vote(maker, up)
    },
    approve(spender, amount, isVolatile) {
      if (isVolatile) {
        return volatileTokenService.approve(spender, amount)
      } else {
        return stableTokenService.approve(spender, amount)
      }
    },
    // TEST
    reload() {
      return seigniorageService.loadProposals()
    },
  }
})
