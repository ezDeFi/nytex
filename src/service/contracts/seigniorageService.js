import BaseService from '../../model/BaseService'
import _ from 'lodash'
import { thousands, weiToNUSD, weiToMNTY, weiToPrice, cutString, decShift } from '@/util/help'
import BigInt from 'big-integer';
export default class extends BaseService {
    async cancel(orderType, id) {
        console.log("cancel " + (orderType ? "buy" : "ask") + "ing order: ", id.toString())
        const store = this.store.getState()
        const contract = store.contracts.seigniorage;
        await contract.methods.cancel(orderType, id)
            .send({ from: store.user.wallet })
    }

    async sellVolatileToken(haveAmount, wantAmount) {
        console.log(haveAmount.toString(), wantAmount.toString())
        return
    }

    async sellStableToken(haveAmount, wantAmount) {
        console.log(haveAmount.toString(), wantAmount.toString())
        return
    }

    async vote(maker, up) {
        console.log(maker.toString(), up)
        const store = this.store.getState()
        const contract = store.contracts.seigniorage;
        await contract.methods.vote(maker, up)
            .send({ from: store.user.wallet })
    }

    async revoke(maker) {
        console.log("revoking proposal: ", maker)
        const store = this.store.getState()
        const contract = store.contracts.seigniorage;
        await contract.methods.revoke(maker)
            .send({ from: store.user.wallet })
    }

    async loadProposals() {
        const store = this.store.getState()
        let methods = store.contracts.seigniorage.methods
        const seigniorageRedux = this.store.getRedux('seigniorage')

        methods.getGlobalParams().call()
            .then((globalParams) => {
                console.log(globalParams);
                this.dispatch(seigniorageRedux.actions.globalParams_update(globalParams));
            });

        methods.getLockdown().call()
            .then((lockdown) => {
                // const zeroAddress = "0x0000000000000000000000000000000000000000";
                // if (lockdown.maker === zeroAddress) {
                //     return;
                // }
                this.dispatch(seigniorageRedux.actions.lockdown_update(lockdown));
            });

        const count = await methods.getProposalCount().call()
        this.dispatch(seigniorageRedux.actions.proposals_reset());
        for (let i = 0; i < count; ++i) {
            methods.getProposal(i).call().then(res => {
                // console.log(res);
                this.dispatch(seigniorageRedux.actions.proposals_update({
                    [res.maker]: {
                        'maker': res.maker,
                        'stake': res.stake,
                        'amount': thousands(weiToNUSD(res.amount)),
                        'slashingRate': decShift(res.slashingRate, -18),
                        'lockdownExpiration': res.lockdownExpiration,
                    }
                }));
                methods.totalVote(res.maker).call().then(totalVote => {
                    // console.log(totalVote);
                    this.dispatch(seigniorageRedux.actions.proposals_update({
                        [res.maker]: {
                            'totalVote': totalVote,
                        }
                    }));
                });
                this.loadVote(res.maker)
            })
        }
    }

    loadVote(maker) {
        const store = this.store.getState()
        const seigniorageRedux = this.store.getRedux('seigniorage')

        const bytes32 = x => {
            return '0x' + x.replace(/^0x/, '').padStart(64, '0')
        }
        const index = (p, k) => {
            return sha3(bytes32(k) + bytes32(p).replace(/^0x/, ''))
        }
        const offset = (p, o) => {
            return bytes32((BigInt(o) + BigInt(p)).toString(16))
        }
        const web3 = store.user.web3
        const sha3 = web3.utils.sha3

        const voter = store.user.wallet

        let key = offset(18, 2) // Preemptive.proposals.vals (maker => Proposal)
        key = index(key, maker) // vals[maker]
        // check the votes map ordinal
        let keyOrd = offset(key, 6 + 1) // Proposal.votes.ordinals (address => uint)
        keyOrd = index(keyOrd, voter) // ordinals[voter]
        web3.eth.getStorageAt(store.contracts.seigniorage._address, keyOrd).then(res => {
            const ord = BigInt(res)
            if (ord == 0) {
                this.dispatch(seigniorageRedux.actions.proposals_update({
                    [maker]: {
                        'vote': undefined,
                    }
                }));
                return
            }
            // cross-check with keys array
            let keyKey = offset(key, 6 + 0) // Proposal.votes.keys
            web3.eth.getStorageAt(store.contracts.seigniorage._address, keyKey).then(res => {
                const len = BigInt(res)
                if (ord > len) {
                    this.dispatch(seigniorageRedux.actions.proposals_update({
                        [maker]: {
                            'vote': undefined,
                        }
                    }));
                    return
                }
                // keyKey = index(keyKey, (ord - BigInt(1)).toString(16)) // keys[ordinal-1]
                // web3.eth.getStorageAt(store.contracts.seigniorage._address, key).then(res => {
                //     console.error('keys[ordinal-1]', res, bytes32(voter), bytes32(voter) === res)
                //     if (bytes32(voter) !== res) {
                //         this.dispatch(seigniorageRedux.actions.proposals_update({[maker]: {
                //             'vote': undefined,
                //         }}));
                //         return
                //     }
                // get the vote direction
                let keyVal = offset(key, 6 + 2) // Proposal.votes.vals (address => bool)
                keyVal = index(keyVal, voter) // vals[voter]
                web3.eth.getStorageAt(store.contracts.seigniorage._address, keyVal).then(res => {
                    console.error('vals[voter]', keyVal, '=', res)
                    this.dispatch(seigniorageRedux.actions.proposals_update({
                        [maker]: {
                            'vote': BigInt(res) != 0,
                        }
                    }));
                })
                // })
            })
        })
    }

    async loadOrders(orderType) {
        const seigniorageRedux = this.store.getRedux('seigniorage')
        // if (orderType) {
        //     this.dispatch(seigniorageRedux.actions.bids_reset());
        // } else {
        //     this.dispatch(seigniorageRedux.actions.asks_reset());
        // }
        const byteFFFF = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        const store = this.store.getState()
        const methods = store.contracts.seigniorage.methods
        //let _id = byteZero
        let id = await methods.top(orderType).call();
        const MAX_ITEMS = 10;
        for (let i = 0; i < MAX_ITEMS; ++i) {
            if (id === byteFFFF) {
                // clear the empty rows
                const order = {
                    'seq': i,
                    'id': id,
                    'maker': '',
                    'amount': '',
                    'price': '',
                };
                if (orderType) {
                    this.dispatch(seigniorageRedux.actions.bids_update({ [i]: order }));
                } else {
                    this.dispatch(seigniorageRedux.actions.asks_update({ [MAX_ITEMS - 1 - i]: order }));
                }
                continue;
            }
            let res = await methods.getOrder(orderType, id).call();
            // console.log(res);
            let mnty = res[orderType ? 2 : 1];
            let nusd = res[orderType ? 1 : 2];
            const order = {
                'seq': i,
                'id': id,
                'maker': cutString(res[0]),
                'amount': thousands(weiToMNTY(mnty)),
                'price': thousands(weiToPrice(mnty, nusd)),
            };
            // console.log(order);
            if (orderType) {
                this.dispatch(seigniorageRedux.actions.bids_update({ [i]: order }));
            } else {
                this.dispatch(seigniorageRedux.actions.asks_update({ [MAX_ITEMS - 1 - i]: order }));
            }
            id = res[4];
        }
    }

    async absorb(amount, sideAddress) {
        console.log(sideAddress);
        const store = this.store.getState()
        const contract = store.contracts.seigniorage;
        await contract.methods.testAbsorb(amount, sideAddress)
            .send({ from: store.user.wallet })
    }

    async reload() {
        this.loadOrders(true)
        this.loadOrders(false)
    }
}
