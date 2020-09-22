import React from 'react' // eslint-disable-line
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { Route, Switch } from 'react-router-dom' // eslint-disable-line
import { Provider } from 'react-redux' // eslint-disable-line
import { ConnectedRouter } from 'react-router-redux' // eslint-disable-line
import store from '@/store'
import config from '@/config'
import { USER_ROLE } from '@/constant'
import { api_request } from './util' // eslint-disable-line
import UserService from '@/service/UserService'
import {Helmet} from "react-helmet"
import { CONTRACTS } from '@/constant'
import Web3 from 'web3'

import './boot'
import './style/index.scss'

import detectEthereumProvider from '@metamask/detect-provider';

const middleware = (render, props) => {
  return render
}

const App = () => { // eslint-disable-line
  return (
    <div>
      <Helmet>
          {/*<script defer src="/assets/js/web310.js"></script>*/}
      </Helmet>
      <Switch id="ss-main">
        {_.map(config.router, (item, i) => {
          const props = _.omit(item, ['page', 'path', 'type'])
          const R = item.type || Route // eslint-disable-line
          return (
            <R path={item.path} key={i} exact component={item.page} {...props} />
          )
        })}
      </Switch>
    </div>
  )
}

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter middleware={middleware} history={store.history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('ss-root')
  )
}

// this returns the provider, or null if it wasn't detected
detectEthereumProvider().then(setupWeb3)

function setupWeb3(provider) {
  if (!provider) {
    console.log('Please install MetaMask or EzDeFi!');
    doLogout()
    return;
  }

  // If the provider returned by detectEthereumProvider is not the same as
  // window.ethereum, something is overwriting it, perhaps another wallet.
  if (provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?');
  }
  // Access the decentralized web!

  /**********************************************************/
  /* Handle chain (network) and chainChanged (per EIP-1193) */
  /**********************************************************/

  // Normally, we would recommend the 'eth_chainId' RPC method, but it currently
  // returns incorrectly formatted chain ID values.
  // let currentChainId = ethereum.chainId;

  ethereum.on('chainChanged', handleChainChanged);

  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    console.log('Chain ID:', _chainId)
    // window.location.reload();
  }

  /***********************************************************/
  /* Handle user accounts and accountsChanged (per EIP-1193) */
  /***********************************************************/

  ethereum
    .request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
      // Some unexpected error.
      // For backwards compatibility reasons, if no accounts are available,
      // eth_accounts will return an empty array.
      console.error(err);
    });

  // Note that this event is emitted on page load.
  // If the array of accounts is non-empty, you're already
  // connected.
  ethereum.on('accountsChanged', handleAccountsChanged);

  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
      doLogout()
    } else if (accounts[0] !== store.getState().user.wallet) {
      doLogin(accounts[0])
    }
  }

  /*********************************************/
  /* Access the user's accounts (per EIP-1102) */
  /*********************************************/

  // You should only attempt to request the user's accounts in response to user
  // interaction, such as a button click.
  // Otherwise, you popup-spam the user like it's 1999.
  // If you fail to retrieve the user's account(s), you should encourage the user
  // to initiate the attempt.
  document.getElementById('connectButton', () => {
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
  })
}

function doLogout() {
  const userRedux = store.getRedux('user')
  store.dispatch(userRedux.actions.loginMetamask_update(false))
}

function doLogin(account) {
  console.log('Account: ', account);
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  const contracts = {
    VolatileToken: new web3.eth.Contract(CONTRACTS.VolatileToken.abi, CONTRACTS.VolatileToken.address),
    StableToken: new web3.eth.Contract(CONTRACTS.StableToken.abi, CONTRACTS.StableToken.address),
    Seigniorage: new web3.eth.Contract(CONTRACTS.Seigniorage.abi, CONTRACTS.Seigniorage.address),
  }

  const userRedux = store.getRedux('user')
  const contractsRedux = store.getRedux('contracts')
  const userService = new UserService()

  store.dispatch(userRedux.actions.loginMetamask_update(true))
  store.dispatch(contractsRedux.actions.volatileToken_update(contracts.VolatileToken))
  store.dispatch(contractsRedux.actions.stableToken_update(contracts.StableToken))
  store.dispatch(contractsRedux.actions.seigniorage_update(contracts.Seigniorage))
  store.dispatch(userRedux.actions.web3_update(web3))

  userService.metaMaskLogin(account)

  // simple trick: not work for entering .../login directly to the browser
  if (userService.path.location.pathname === '/login') {
    userService.path.goBack();
  }
}

if (sessionStorage.getItem('api-token')) { // eslint-disable-line
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

      render()
    }
  })
} else {
  render()
}
