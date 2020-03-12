import * as userAction from '../action/userAction'

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case userAction.INCREMENT:
      return Object.assign({}, state, {
        count: state.count + 1,
      })
    case userAction.UPDATE_WALLET_ADDRESS:
      return Object.assign({}, state, {
        walletAddress: action.walletAddress
      })
    case userAction.UPDATE_LOGIN_STATUS:
      return Object.assign({}, state, {
        isLogin: action.isLogin
      })
    case userAction.UPDATE_LOGOUT_STATUS:
      return Object.assign({}, state, {
        justLogout: action.justLogout
      })
    case userAction.UPDATE_BALANCE:
      return Object.assign({}, state, {
        balance: action.balance
      })
    case userAction.UPDATE_WEB3:
      Object.assign({}, state, {
        web3: action.web3
      })
      return state
    default:
      return state
  }
}

const initialState = {
  count        : 0,
  walletAddress: '',
  isLogin      : false,
  justLogout   : false,
  web3         : null,
  balance      : 0
}

export default reducer
