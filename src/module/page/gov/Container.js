import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import GovernanceService from '@/service/contracts/governanceService'
import BigInt from 'big-integer';
var curWallet = null
export default createContainer(Component, (state) => {
  const userService = new UserService()
  const govService = new GovernanceService()

  return {
    wallet: state.user.wallet,
    balance: state.user.balance,
  }
}, () => {
  const govService = new GovernanceService()

  return {
    deposit(amount) {
      if (amount > BigInt(this.balance)) {
        throw "insufficient native NTY"
      }
      return govService.deposit(amount.toString())
    },
    withdraw(amount) {
      if (amount > BigInt(this.volatileTokenBalance)) {
        throw "insufficient MNTY"
      }
      return govService.withdraw(amount)
    },
  }
})
