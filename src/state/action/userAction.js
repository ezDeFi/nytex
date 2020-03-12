export const INCREMENT = "INCREMENT"
export const UPDATE_WALLET_ADDRESS = "UPDATE_WALLET_ADDRESS"
export const UPDATE_LOGIN_STATUS = "UPDATE_LOGIN_STATUS"
export const UPDATE_BALANCE = "UPDATE_BALANCE"
export const UPDATE_WEB3 = "UPDATE_WEB3"
export const UPDATE_LOGOUT_STATUS = "UPDATE_LOGOUT_STATUS"

export const updateWalletAddress = walletAddress => ({
  type: UPDATE_WALLET_ADDRESS,
  walletAddress
})

export const updateLoginStatus = isLogin => ({
  type: UPDATE_LOGIN_STATUS,
  isLogin
})

export const updateBalance = balance => ({
  type: UPDATE_BALANCE,
  balance
})

export const updateLogoutStatus = justLogout => ({
  type: UPDATE_LOGOUT_STATUS,
  justLogout
})