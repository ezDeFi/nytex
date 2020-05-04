import BaseService from '../model/BaseService'
import Web3 from 'web3'
import WalletService from '@/service/WalletService'
import { WEB3, CONTRACTS } from '@/constant'

export default class extends BaseService {
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

  getBalance () {
    const storeUser = this.store.getState().user
    let { web3, wallet } = storeUser
    console.log(web3, wallet)
    web3.eth.getBalance(wallet).then((balance) => {
      const userRedux = this.store.getRedux('user')
      this.dispatch(userRedux.actions.balance_update(balance))
    })
  }
}
