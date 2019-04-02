import React from 'react';
import ReactDOM from 'react-dom'
import {Helmet} from "react-helmet"
import _ from 'lodash';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';
import store from '@/store';
import config from '@/config';
import {USER_ROLE} from '@/constant'
import {api_request, isMobile} from "./util";
import InitContractService from '@/service/InitContractService'
import SocketService from '@/service/SocketService'
import UserService from '@/service/UserService'
import io from 'socket.io-client'
import Web3 from 'web3'

import './boot';
import './style/index.scss';
import './style/mobile.scss';

const middleware = (render, props)=>{
	return render;
};

const App = () => {
    return (
        <div>
            <Helmet>
                <meta name="cr-env" content={process.env.NODE_ENV} />
                <meta name="cr-version-number" content={process.env.CR_VERSION ? '' + process.env.CR_VERSION : 'unknown'} />
                {process.env.NODE_ENV === 'production' && <script defer src="/assets/js/rollbar_prod.js"></script>}
                {process.env.NODE_ENV === 'staging' && <script defer src="/assets/js/rollbar_staging.js"></script>}
                {process.env.NODE_ENV === 'production' && <script async src={'https://www.googletagmanager.com/gtag/js?id=' + process.env.GA_ID}></script>}
                {process.env.NODE_ENV === 'production' && <script>{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '` + process.env.GA_ID + `');`}</script>}
                {window.location.pathname === '/' && <script defer src="/assets/js/luwa.js"></script>}
                {process.env.NODE_ENV === 'production' && <script>{`
                    (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:1076743,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')`}
                </script>}
                {/*<script>{
                    (function() {
                        window.Intercom("update");
                    })()
                }</script>*/}
            </Helmet>
            <Switch id="ebp-main">

                {
                    _.map(config.router, (item, i) => {
                        const props = _.omit(item, ['page', 'path', 'type']);
                        const R = item.type || Route;
                        return (
                            <R path={item.path} key={i} exact component={item.page} {...props} />
                        );
                    })
                }
            </Switch>
        </div>
    );
};

const render = () => {
    ReactDOM.render(
        (
            <Provider store={store}>
                <ConnectedRouter middleware={middleware} history={store.history}>
                    <App/>
                </ConnectedRouter>
            </Provider>
        ),
        document.getElementById('ebp-root')
    );
};

if (!sessionStorage.getItem('api-token') && localStorage.getItem('api-token')) {
    sessionStorage.setItem('api-token', localStorage.getItem('api-token'))
}

if (sessionStorage.getItem('api-token') && !localStorage.getItem('api-token')) {
    store.history.push('/login')
    // sessionStorage.clear();
}

const contractRedux = store.getRedux('contract')
const userRedux = store.getRedux('user')
const initContractService = new InitContractService()
const userService = new UserService()

let isRequest = false
let alreadyCallLogin = false
let netWorkId

function setupWeb3() {
    window.web3.eth.getAccounts(async(err, accounts) => {
        if (!err) {
            if (accounts.length > 0) {
                const userState = store.getState('user').user
                store.dispatch(contractRedux.actions.connectedMetamask_update(true))
                console.log('account detected : ', accounts[0])
                console.log('account = ', accounts[0])
                store.dispatch(userRedux.actions.walletAddress_update(accounts[0]))

                if (userState.walletAddress && userState.walletAddress !== accounts[0]) {
                    window.location.reload()
                }

                const userExists = await userService.checkUserExists(accounts[0])
                if (userExists && !userState.is_login && !alreadyCallLogin) {
                    await userService.loginByMetamask(accounts[0])
                    userService.getWalletBalance()
                    alreadyCallLogin = true

                    setTimeout(() => {
                        alreadyCallLogin = false
                    }, 1000)
                }
                // console.log('account = ', accounts[0])
                // store.dispatch(userRedux.actions.walletAddress_update(accounts[0]))
                // store.dispatch(userRedux.actions.is_login_update(true))
            } else {
                if (!isRequest) {
                    isRequest = true
                    // Request account access if needed
                    await window.ethereum.enable()
                }
                store.dispatch(contractRedux.actions.connectedMetamask_update(false))
            }
        }
    })
    window.web3.version.getNetwork((err, netId) => {
        if (err) {} else

        if (netWorkId && netWorkId !== netId)  {
            window.location.reload()
        }

        if (netId == 1) {
            console.log('NetworkId=', netId)
            store.dispatch(contractRedux.actions.isMainnet_update(true))
        } else {
            console.log('NetworkId=', netId)
            store.dispatch(contractRedux.actions.isMainnet_update(false))
        }
        netWorkId = netId
    })
}

function setupWeb3WithDappBrowser() {
    window.web3.eth.getAccounts(async(err, accounts) => {
        if (!err) {
            if (accounts.length > 0) {
                const userState = store.getState('user').user
                store.dispatch(contractRedux.actions.connectedMetamask_update(true))

                if (userState.walletAddress && userState.walletAddress !== accounts[0]) {
                    window.location.reload()
                }

                const userExists = await userService.checkUserExists(accounts[0])
                if (userExists && !userState.is_login && !alreadyCallLogin) {
                    await userService.loginByMetamask(accounts[0])
                    userService.getWalletBalance()
                    alreadyCallLogin = true

                    setTimeout(() => {
                        alreadyCallLogin = false
                    }, 1000)
                }

                store.dispatch(userRedux.actions.walletAddress_update(accounts[0]))
                // store.dispatch(userRedux.actions.is_login_update(true))
            } else {
                if (!isRequest) {
                    isRequest = true
                    // Request account access if needed
                    await window.ethereum.enable()
                }
                store.dispatch(contractRedux.actions.connectedMetamask_update(false))
            }
        }
    })
}

if (window.web3) {
    //window.web3 = window.web3
    initContractService.initContract(window.web3)
    if (window.web3 && window.web3.currentProvider.isTrust) {
        // window.web3 = new Web3(window.web3.currentProvider)
        setupWeb3WithDappBrowser()
    } else {
        setupWeb3()
        window.web3.currentProvider.publicConfigStore.on('update', async () => {
            setupWeb3()
        })
    }
}

render();
