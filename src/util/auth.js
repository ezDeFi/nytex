import store from '@/store'

import { USER_ROLE } from '@/constant'
import { api_request } from './'
import UserService from '@/service/UserService'
import { CONTRACTS } from '@/constant'
import Web3 from "web3";

const userRedux = store.getRedux('user')
const contractsRedux = store.getRedux('contracts')
const userService = new UserService()
let isRequest = false
let isLoggedIn = false

async function setupWeb3 (callback) {
  // await window.ethereum.enable()
  await window.web3.eth.getAccounts(async (err, accounts) => {
    if (err) return
    if (accounts.length > 0) {
      // detect account switch
      const wallet = store.getState().user.wallet;
      isLoggedIn = isLoggedIn && wallet === accounts[0];
      if (!isLoggedIn) {
        const web3 = new Web3(window.ethereum)

        // const contracts = {
        //   // ReadWrite: new web3.eth.Contract(CONTRACTS.ReadWrite.abi, CONTRACTS.ReadWrite.address),
        //   VolatileToken: new web3.eth.Contract(CONTRACTS.VolatileToken.abi, CONTRACTS.VolatileToken.address),
        //   StableToken: new web3.eth.Contract(CONTRACTS.StableToken.abi, CONTRACTS.StableToken.address),
        //   Seigniorage: new web3.eth.Contract(CONTRACTS.Seigniorage.abi, CONTRACTS.Seigniorage.address),
        // }
        //
        // store.dispatch(userRedux.actions.loginMetamask_update(true))
        // store.dispatch(contractsRedux.actions.volatileToken_update(contracts.VolatileToken))
        // store.dispatch(contractsRedux.actions.stableToken_update(contracts.StableToken))
        // store.dispatch(contractsRedux.actions.seigniorage_update(contracts.Seigniorage))
        store.dispatch(userRedux.actions.web3_update(web3))

        userService.metaMaskLogin(accounts[0])
        isLoggedIn = true

        // simple trick: not work for entering .../login directly to the browser
        if (userService.path.location.pathname === '/login') {
          // userService.path.goBack()
          userService.path.push('/txcode')
        }
        callback()
      }
    } else {
      if (!isRequest) {
        isRequest = true
        await window.ethereum.enable()
      }
      store.dispatch(userRedux.actions.loginMetamask_update(false))
      isLoggedIn = false
      userService.path.push('/login')
    }
  })
}

export const loginEzdefi = (callback) => {
  if (window.ethereum) {
    setupWeb3(callback)
    if (window.web3.currentProvider.publicConfigStore) {
      window.web3.currentProvider.publicConfigStore.on('update', async () => {
        setupWeb3(callback)
      })
    }
  } else {
    store.dispatch(userRedux.actions.loginMetamask_update(false))
  }
}

export const getUserProfile = (callback) => {
  const userRedux = store.getRedux('user')
  api_request({
    path: '/user/current_user',
    success: data => {
      store.dispatch(userRedux.actions.is_login_update(true))
      if ([USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(data.role)) {
        store.dispatch(userRedux.actions.is_admin_update(true))
      }
      store.dispatch(userRedux.actions.profile_update(data.profile))
      store.dispatch(userRedux.actions.role_update(data.role))

      callback()
    }
  })
}