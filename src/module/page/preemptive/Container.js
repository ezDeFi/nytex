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
    seigniorageService.loadProposals()
  }

  async function load () {
    userService.loadBlockNumber()
    userService.getBalance()

    volatileTokenService.loadMyVolatileTokenBalance()
    stableTokenService.loadMyStableTokenBalance()

    // Approve
    volatileTokenService.loadVolatileTokenAllowance()
    stableTokenService.loadStableTokenAllowance()
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
    proposals: state.seigniorage.proposals,
    // Approve
    volatileTokenAllowance: state.user.volatileTokenAllowance,
    stableTokenAllowance: state.user.stableTokenAllowance
  }
}, () => {
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService = new StableTokenService()
  const seigniorageService = new SeigniorageService()

  return {
    async propose(amount, stake, slashingDuration, lockdownExpiration) {
      return await volatileTokenService.propose(amount, stake, slashingDuration, lockdownExpiration)
    },
    async revoke(maker) {
      return await seigniorageService.revoke(maker)
    },
    async vote(maker, up) {
      return await seigniorageService.vote(maker, up)
    },
    // TEST
    async reload() {
      return await seigniorageService.loadProposals()
    },
    // Approve
    async approve(spender, amount, isVolatile) {
      if (isVolatile) {
        return await volatileTokenService.approve(spender, amount) 
      } else {
        return await stableTokenService.approve(spender, amount)
      } 
    },
  }
})
