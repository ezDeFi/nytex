import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import ConfigService from '@/service/ConfigService'
import VolatileTokenService from '@/service/contracts/volatileTokenService'
import StableTokenService from '@/service/contracts/stableTokenService'
var curWallet = null
export default createContainer(Component, (state) => {
  const userService = new UserService()
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService = new StableTokenService()

  async function loadOnInit () {
    load()
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
  }
}, () => {
  const configService = new ConfigService()
  return {
    get(key, address) {
      return configService.get(key, address)
    },
    set(key, value) {
      return configService.set(key, value)
    },
    erc20Symbol(address) {
      return configService.erc20Symbol(address)
    }
  }
})
