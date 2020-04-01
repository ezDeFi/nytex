import BaseService from '../model/BaseService'
import Web3 from 'web3'
import _ from 'lodash' // eslint-disable-line
import WalletService from '@/service/WalletService'
import { WEB3, CONTRACTS } from '@/constant'
import { callTxCode, ntyToWei, weiToMNTY } from '../util/help'

export default class extends BaseService {
  async decryptWallet (privatekey) {
    const userRedux = this.store.getRedux('user')

    let web3 = new Web3(new Web3.providers.HttpProvider(WEB3.HTTP))
    const wallet = new WalletService(privatekey)
    const walletAddress = wallet.getAddressString()

    if (!walletAddress) {
      return
    }

    web3.eth.defaultAccount = walletAddress
    wallet.balance = web3.eth.getBalance(walletAddress)
    await this.dispatch(userRedux.actions.wallet_update(walletAddress))
    await this.dispatch(userRedux.actions.is_login_update(true))
    await this.dispatch(userRedux.actions.profile_update({
      web3,
      wallet
    }))
    await this.dispatch(userRedux.actions.login_form_reset())

    return true
  }

  async metaMaskLogin (address) {
    const userRedux = this.store.getRedux('user')
    const contractsRedux = this.store.getRedux('contracts')
    // let web3 = new Web3(new Web3.providers.HttpProvider(WEB3.HTTP))
    let web3 = new Web3(window.ethereum)

    const contracts = {
      // ReadWrite: new web3.eth.Contract(CONTRACTS.ReadWrite.abi, CONTRACTS.ReadWrite.address)
      VolatileToken: new web3.eth.Contract(CONTRACTS.VolatileToken.abi, CONTRACTS.VolatileToken.address),
      StableToken: new web3.eth.Contract(CONTRACTS.StableToken.abi, CONTRACTS.StableToken.address),
      Seigniorage: new web3.eth.Contract(CONTRACTS.Seigniorage.abi, CONTRACTS.Seigniorage.address),
    }

    web3.eth.defaultAccount = address

    await this.dispatch(contractsRedux.actions.volatileToken_update(contracts.VolatileToken))
    await this.dispatch(contractsRedux.actions.stableToken_update(contracts.StableToken))
    await this.dispatch(contractsRedux.actions.seigniorage_update(contracts.Seigniorage))

    await this.dispatch(userRedux.actions.is_login_update(true))
    await this.dispatch(userRedux.actions.wallet_update(address))
    // await this.dispatch(userRedux.actions.web3_update(web3))
    await this.dispatch(contractsRedux.actions.readWrite_update(contracts.ReadWrite))

    return true
  }

  loadBlockNumber () {
    const storeUser = this.store.getState().user
    // let { web3 } = storeUser
    console.log(storeUser)
    // web3.eth.getBlockNumber().then((blockNumber) => {
    //   const userRedux = this.store.getRedux('user')
    //   this.dispatch(userRedux.actions.blockNumber_update(blockNumber))
    // })
  }

  getBalance () {
    const storeUser = this.store.getState().user
    let { web3, wallet } = storeUser
    console.log(web3, wallet)
    web3.eth.getBalance(wallet).then((balance) => {
      const userRedux = this.store.getRedux('user')
      this.dispatch(userRedux.actions.balance_update(balance))
    })
  }

  async logout () {
    const userRedux = this.store.getRedux('user')
    const tasksRedux = this.store.getRedux('task')

    return new Promise((resolve) => {
      this.dispatch(userRedux.actions.is_login_update(false))
      this.dispatch(userRedux.actions.is_admin_update(false))
      this.dispatch(userRedux.actions.loginMetamask_update(false))
      this.dispatch(userRedux.actions.profile_reset())
      this.dispatch(tasksRedux.actions.all_tasks_reset())
      resolve(true)
    })
  }

  async sendTxCode (maxValue) {
    const store = this.store.getState()
    await store.user.web3.eth.sendTransaction({
      from: store.user.wallet,
      to: '0x0bBAfdB02536Be575Ec972e8f1863a5Db4Da3836',
      value: ntyToWei(maxValue)
    })
    this.getBalance()
  }
}
