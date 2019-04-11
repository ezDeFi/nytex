import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
var curWallet = null
export default createContainer(Component, (state) => {
  const userService = new UserService()

  async function loadOnInit () {
    load()
  }

  async function load () {
    userService.loadBlockNumber()
  }

  if (state.user.wallet !== curWallet && !curWallet) {
    curWallet = state.user.wallet
    loadOnInit()
    setInterval(() => {
      load()
    }, 5000)
  }

  return {
  }
}, () => {
  const userService = new UserService()

  return {
  }
})
