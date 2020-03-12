import store from "../state";

export const checkLogin = (callback) => {
  const justLogout = store.getState().user.justLogout
  if (justLogout) {
    callback()
    return
  }

  window.web3.eth.getAccounts(async (err, accounts) => {
    if (!accounts[0]) {
      callback()
    }
  })
}

export const loginEzdefi = async (callback = null) => {
  await window.ethereum.enable()
  store.dispatch({type: 'UPDATE_LOGIN_STATUS', isLogin: true});
  if (callback) callback();
}
