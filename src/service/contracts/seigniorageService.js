import BaseService from '../../model/BaseService'
import _ from 'lodash'
import { thousands, weiToNUSD, weiToMNTY, weiToPrice, cutString, decShift } from '../../util/help'
import { sendTx } from '../../util/help'

export default class extends BaseService {
    async cancel(orderType, id) {
        console.log("cancel " + (orderType ? "buy" : "ask") + "ing order: ", id.toString())
        const store = this.store.getState()
        const contract = store.contracts.seigniorage;
        await sendTx(store.user.web3, {
            from: store.user.wallet,
            to: contract._address,
            data: contract.methods.cancel(orderType, id).encodeABI(),
        });
    }

    async sellVolatileToken(haveAmount, wantAmount) {
        console.log(haveAmount.toString(), wantAmount.toString())
        return
    }

    async sellStableToken(haveAmount, wantAmount) {
        console.log(haveAmount.toString(), wantAmount.toString())
        return
    }

    async vote(maker, up){
        console.log(maker.toString(), up)
        const store = this.store.getState()
        const contract = store.contracts.seigniorage;
        await sendTx(store.user.web3, {
            from: store.user.wallet,
            to: contract._address,
            data: contract.methods.vote(maker, up).encodeABI(),
        });
    }

    async revoke(maker) {
        console.log("revoking proposal: ", maker)
        const store = this.store.getState()
        const contract = store.contracts.seigniorage;
        await sendTx(store.user.web3, {
            from: store.user.wallet,
            to: contract._address,
            data: contract.methods.revoke(maker).encodeABI(),
        });
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
                this.dispatch(seigniorageRedux.actions.proposals_update({[res.maker]: {
                    'maker': res.maker,
                    'stake': thousands(weiToMNTY(res.stake)),
                    'amount': thousands(weiToNUSD(res.amount)),
                    'slashingRate': decShift(res.slashingRate, -3),
                    'lockdownExpiration': res.lockdownExpiration,
                }}));
                methods.totalVote(res.maker).call().then(totalVote => {
                    // console.log(totalVote);
                    this.dispatch(seigniorageRedux.actions.proposals_update({[res.maker]: {
                        'totalVote': thousands(weiToMNTY(totalVote)),
                    }}));
                });
            })
        }
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
                    this.dispatch(seigniorageRedux.actions.bids_update({[i]: order}));
                } else {
                    this.dispatch(seigniorageRedux.actions.asks_update({[MAX_ITEMS-1-i]: order}));
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
                this.dispatch(seigniorageRedux.actions.bids_update({[i]: order}));
            } else {
                this.dispatch(seigniorageRedux.actions.asks_update({[MAX_ITEMS-1-i]: order}));
            }
            id = res[4];
        }
    }

    async absorb(amount, sideAddress) {
        console.log(sideAddress);
        const store = this.store.getState()
        const contract = store.contracts.seigniorage;
        await sendTx(store.user.web3, {
            from: store.user.wallet,
            to: contract._address,
            data: contract.methods.testAbsorb(amount, sideAddress).encodeABI(),
        });
    }

    async reload() {
        this.loadOrders(true)
        this.loadOrders(false)
    }
}
