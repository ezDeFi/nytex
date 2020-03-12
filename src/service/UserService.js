import store from '../state/index'
import Web3  from "web3";
import * as userAction  from "../state/action/userAction";

class UserService {
  constructor() {
    this.web3 = new Web3(window.ethereum)
    this.getTransactionHistory.bind(this)
  }

  async fetchData(important) {
    if(important || !store.getState().user.walletAddress) {
      window.web3.eth.getAccounts(async (err, accounts) => {
        store.dispatch(userAction.updateWalletAddress(accounts[0]));
        store.dispatch(userAction.updateLoginStatus(true));

        this.web3.eth.getBalance(accounts[0]).then((balance) => {
          store.dispatch(userAction.updateBalance(this.web3.utils.fromWei(balance, 'ether')))
        })
      });
    }
  }

  async logout(callback) {
    await store.dispatch(userAction.updateWalletAddress(''))
    await store.dispatch(userAction.updateLoginStatus(false))
    await store.dispatch(userAction.updateLogoutStatus(true))
    await store.dispatch(userAction.updateBalance(0))

    callback()
  }

  sendTx(value) {
    var that = this;
    this.web3.eth.sendTransaction({
      from: store.getState().user.walletAddress,
      to: '0x0bBAfdB02536Be575Ec972e8f1863a5Db4Da3836',
      value: value * Math.pow(10, 18)
    }).then(
      that.fetchData.bind(that)
    )
  }

  getTransactionHistory() {
    // const contractAddress = store.getState().user.walletAddress
    // this.web3.eth.getTransactionCount(contractAddress).then(console.log)
  }


}
export default new UserService()
