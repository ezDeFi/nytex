import React from 'react'
import BaseService from '../model/BaseService'
import Web3 from 'web3'
import _ from 'lodash'
import Tx from 'ethereumjs-tx'
import WalletService from '@/service/WalletService'
import DepositService from '@/service/DepositService'
import RewardService from '@/service/RewardService'
import {WEB3, TOKEN_ADDRESS, ABI_TOKEN_ERC20, WS_PROVIDER, HTTP_PROVIDER, ETHERS_SCAN, NETWORK_ID} from '@/constant'
import { Notification, Message } from 'antd'
import {isMobile} from "../util"

import wntyContractData from '../../build/contracts/WNTY.json'
import nusdContractData from '../../build/contracts/NUSD.json';
import bookContractData from '../../build/contracts/Orderbook.json';

Notification.config({
    placement: 'bottomRight',
    bottom: 50,
    duration: 5
});

export default class extends BaseService {
    async initContract(_web3) {
        const contractRedux = this.store.getRedux('contract')

        // const web3 = new Web3(new Web3.providers.WebsocketProvider(WS_PROVIDER))
        var web3 = _web3 === undefined ? new Web3(HTTP_PROVIDER) : new Web3(_web3.currentProvider)
        // const contract = new web3.eth.Contract(ABI_TOKEN_ERC20, TOKEN_ADDRESS)

        const wnty = new web3.eth.Contract(wntyContractData.abi, wntyContractData.networks[NETWORK_ID].address)
        const nusd = new web3.eth.Contract(nusdContractData.abi, nusdContractData.networks[NETWORK_ID].address)
        const book = new web3.eth.Contract(bookContractData.abi, bookContractData.networks[NETWORK_ID].address)
        // console.log('citizen', citizenContract, citizenContractData.abi, citizenContractData.networks[NETWORK_ID].address)

        // const provider = web3.currentProvider
        // provider.on('connect', () => {
        //     console.log('=== Websocket Provider connection established! ===')
        // })

        // LISTEN EVENTS
        // this.listenEvents(contract, web3)

        // provider.connection.onclose = () => {
        //     console.log('======Conection Close=======')
        //     this.initContract()
        // }

        // provider.connection.onerror = () => {
        //     console.log('======Conection Error=======')
        //     this.initContract()
        // }

        this.dispatch(contractRedux.actions.lib_update({web3}))
        // this.dispatch(contractRedux.actions.contract_update(contract))
        this.dispatch(contractRedux.actions.wnty_update(wnty))
        this.dispatch(contractRedux.actions.nusd_update(nusd))
        this.dispatch(contractRedux.actions.book_update(book))
        // this.listenEventDepositSuccess(contract)
        // this.listenEventRewardRoundWinner(contract)
        // this.listenEventRewardJackpotWinner(contract)
        // this.getJackpotInfo(contract)
        // this.getRoundInfo(contract)
    }

    async listenEvents(contract, web3) {
        const blockNumber = await web3.eth.getBlockNumber()
        const depositService = new DepositService()

        setInterval(() => {
            this.intervalContract(contract, web3, blockNumber, depositService)
        }, 6000)
    }

    async intervalContract(contract, web3, blockNumber, depositService) {
        let scanBlock = sessionStorage.getItem('blockNumber') || 0

        if (scanBlock < blockNumber) {
            scanBlock = blockNumber
        }

        contract.getPastEvents('allEvents', {fromBlock: scanBlock, toBlock: 'latest'}, async (err, events) => {
            if (events && events.length > 0) {
                const newBlockNumber = events[events.length - 1].blockNumber
                console.log('newBlockNumber', newBlockNumber)
                if (newBlockNumber > scanBlock) {
                    sessionStorage.setItem('blockNumber', newBlockNumber);

                    for (let event of events) {
                        if (event.event === 'DepositSuccess') {
                            Notification.info({
                                message: 'Deposit Success!',
                                description: `${this.walletFormat(event.returnValues._from)} (${event.returnValues._amount / 1e18} ETH)`
                            })

                            this.getRoundInfo(contract)
                        } else if (event.event === 'RewardRoundWinner') {
                            const countRound = await contract.methods.countRound().call()

                            Notification.success({
                                message: `Fisnish reward round ${countRound - 1}`,
                                description: `We are finish round ${countRound - 1}`,
                            })

                            setTimeout(() => {
                                this.getRoundInfo(contract)
                                this.getJackpotInfo(contract)
                                depositService.getPlayersRound()
                            }, 1000)
                        } else if (event.event === 'RewardJackpotWinner') {
                            const countJackpot = await contract.methods.countJackpot().call()

                            Notification.success({
                                message: `Fisnish reward jackpot ${countJackpot - 1}`,
                                description: `We are finish round ${countJackpot - 1}`,
                            })

                            setTimeout(() => {
                                this.getJackpotInfo(contract)
                                depositService.getPlayersJackpot()
                            }, 1000)
                        }
                    }
                }
            }
        })
    }

    async getJackpotInfo(contract) {
        const contractRedux = this.store.getRedux('contract')
        const store = this.store.getState().contract
        let methods

        if (contract) {
            methods = contract.methods
        } else {
            methods = store.contract.methods
        }

        if (!methods) {
            return
        }

        const amountJackpot = await methods.amountJackpot().call()
        const countPlayerJackpot = await methods.countPlayerJackpot().call()
        const jackpotTime = await methods.jackpotTime().call()
        const countJackpot = await methods.countJackpot().call()
        await this.dispatch(contractRedux.actions.countJackpot_update(countJackpot.toString()))
        await this.dispatch(contractRedux.actions.amountJackpot_update(amountJackpot.toString()))
        await this.dispatch(contractRedux.actions.countPlayerJackpot_update(countPlayerJackpot.toString()))
        await this.dispatch(contractRedux.actions.jackpotTime_update(jackpotTime.toString()))
    }

    async getRoundInfo(contract) {
        const contractRedux = this.store.getRedux('contract');
        const store = this.store.getState().contract
        let methods

        if (contract) {
            methods = contract.methods
        } else {
            methods = store.contract.methods
        }

        if (!methods) {
            return
        }

        const amountRound = await methods.amountRound().call()
        const countPlayerRound = await methods.countPlayerRound().call()
        const roundTime = await methods.roundTime().call()
        const countRound = await methods.countRound().call()

        await this.dispatch(contractRedux.actions.countRound_update(countRound.toString()))
        await this.dispatch(contractRedux.actions.amountRound_update(amountRound.toString()))
        await this.dispatch(contractRedux.actions.countPlayerRound_update(countPlayerRound.toString()))
        await this.dispatch(contractRedux.actions.roundTime_update(roundTime.toString()))
    }

/*     async getMyRef() {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState().user
        const wallet = store.walletAddress
        const citizen = this.store.getState().contract.citizen
        const myRef = await citizen.methods.getRef(wallet).call()
        await this.dispatch(userRedux.actions.myRef_update(myRef))
    } */

/*     async getRefAddress(_address) {
        const storeUser = this.store.getState().user
        // let {callWeb3, sendWeb3, callDiceContract, sendDiceContract, wallet} = storeUser.profile
        let {callCitizenContract, wallet} = storeUser.profile
        return await callCitizenContract.methods.getRef(_address).call({from: wallet})
    } */

    async getCountRound() {
        const contractRedux = this.store.getRedux('contract')
        const contract = this.store.getState().contract
        const countRound = await contract.methods.countRound().call()
        await this.dispatch(contractRedux.actions.countRound_update(countRound.toString()))
    }

    async getCountJackpot() {
        const contractRedux = this.store.getRedux('contract')
        const contract = this.store.getState().contract
        const countJackpot = await contract.methods.countJackpot().call()
        await this.dispatch(contractRedux.actions.countJackpot_update(countJackpot.toString()))
    }

    async getPlayers() {
        const contractRedux = this.store.getRedux('contract');
        const store = this.store.getState().contract;
        let players = [];

        store.contract.countPlayerJackpot((err, rs) => {
            for (let i = 0; i < rs; i++) {
                store.contract.players(i, (err, player) => {
                    players.push({
                        address: player[0],
                        playing: player[1],
                        playingJackpot: player[2]
                    })
                    this.dispatch(contractRedux.actions.players_update(players));
                });
            }
        });
    }

    async depositByMetaMask(amount) {
        const contract = this.store.getState().contract
        if (!contract.isMainnet || !contract.connectedMetamask) {
            if (!isMobile()) {
                return Message.error('Please connect to mainnet by Metamask!')
            }
        }

        window.web3.eth.sendTransaction({
            to: TOKEN_ADDRESS,
            value: window.web3.toWei(amount, 'ether')
        }, (err, rs) => {
            if (err) {
                return Message.error('Deposit error, please check your wallet and deposit again!')
            }
            return Message.success(<p>Deposit success!, <a style={{color: '#3498db'}} target="_blank" href={`${ETHERS_SCAN}${rs}`}>View your status transaction</a></p>)
        })
    }

    async deposit(amount, privatekey) {
        const contractRedux = this.store.getRedux('contract')
        const store = this.store.getState().contract
        const web3 = store.lib.web3

        const wallet = new WalletService(privatekey)
        const walletAddress = wallet.getAddressString()
        const nonce = await web3.eth.getTransactionCount(walletAddress)

        const rawTx = {
            nonce: nonce,
            from: walletAddress,
            value: web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether')),
            to: TOKEN_ADDRESS,
            gasPrice: web3.utils.toHex(30000000000),
            gasLimit: web3.utils.toHex(300000)
        }

        this.sendRawTransaction(rawTx, web3, wallet);
    }

    sendRawTransaction(rawTx, web3, wallet) {
        const privatekey = wallet.getPrivateKey()
        const tx = new Tx(rawTx)
        tx.sign(privatekey)
        const serializedTx = tx.serialize()

        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, rs) => {
            if (err) {
                return Message.error('Deposit error, please check your wallet and deposit again!')
            }
            return Message.success(<p>Deposit success!, <a style={{color: '#3498db'}} target="_blank" href={`${ETHERS_SCAN}${rs}`}>View your status transaction</a></p>)
        })
    }

    async estimateGas(rawTx, web3) {
        let gas;

        try {
            gas = await web3.eth.estimateGas(rawTx);
        } catch (err) {
            gas = 100000;
        }

        return gas;
    }

    listenEventDepositSuccess(contract) {
        const depositRedux = this.store.getRedux('deposit')
        const depositService = new DepositService()

        contract.events.DepositSuccess((err, rs) => {
            Notification.info({
                message: 'Deposit Success!',
                description: `${this.walletFormat(rs.returnValues._from)} (${rs.returnValues._amount / 1e18} ETH)`
            })

            this.getRoundInfo(contract)
        })
    }

    walletFormat(wallet) {
        const start = wallet.substring(0, 6)
        const end = wallet.substring(wallet.length - 6, wallet.length)
        return `${start}...${end}`
    }

    async listenEventRewardRoundWinner(contract) {
        const redux = this.store.getRedux('contract')
        const depositService = new DepositService()

        contract.events.RewardRoundWinner(async (err, rs) => {
            const countRound = await contract.methods.countRound().call()

            Notification.success({
                message: `Fisnish reward round ${countRound - 1}`,
                description: `We are finish round ${countRound - 1}`,
            })

            setTimeout(() => {
                this.getRoundInfo(contract)
                this.getJackpotInfo(contract)
                depositService.getPlayersRound()
            }, 1000)
        })
    }

    async listenEventRewardJackpotWinner(contract) {
        const redux = this.store.getRedux('contract')
        const depositService = new DepositService()

        contract.events.RewardJackpotWinner(async (err, rs) => {
            const countJackpot = await contract.methods.countJackpot().call()

            Notification.success({
                message: `Fisnish reward jackpot ${countJackpot - 1}`,
                description: `We are finish round ${countJackpot - 1}`,
            })

            setTimeout(() => {
                this.getJackpotInfo(contract)
                depositService.getPlayersJackpot()
            }, 1000)
        })
    }
}
