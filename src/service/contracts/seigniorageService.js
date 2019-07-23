import BaseService from '../../model/BaseService'
import _ from 'lodash'
import { empty } from 'glamor';
import { thousands, weiToNUSD, weiToMNTY, weiToPrice, cutString} from '../../util/help'
import { DECIMALS } from '@/constant'
import web3 from 'web3';

const BN = web3.utils.BN;

// var BigNumber = require('big-number');
var BigNumber = require('bignumber.js');

export default class extends BaseService {
    async cancel(orderType, id) {
        console.log("cancel " + (orderType ? "buy" : "ask") + "ing order: ", id.toString())
        const store = this.store.getState()
        let wallet = store.user.wallet
        let methods = store.contracts.seigniorage.methods
        await methods.cancel(orderType, id).send({from: wallet})
        return
    }

    async sellVolatileToken(haveAmount, wantAmount) {
        console.log(haveAmount.toString(), wantAmount.toString())
        return
    }

    async sellStableToken(haveAmount, wantAmount) {
        console.log(haveAmount.toString(), wantAmount.toString())
        return
    }


    async revoke(maker) {
        console.log("revoking proposal: ", maker)
        const store = this.store.getState()
        let wallet = store.user.wallet
        let methods = store.contracts.seigniorage.methods
        await methods.revoke(maker).send({from: wallet})
    }

    async loadProposals() {
        const store = this.store.getState()
        let methods = store.contracts.seigniorage.methods
        const seigniorageRedux = this.store.getRedux('seigniorage')
        const count = await methods.getProposalCount().call()
        this.dispatch(seigniorageRedux.actions.proposals_reset());
        for (let i = 0; i < count; ++i) {
            methods.getProposal(i).call().then(res => {
                console.log(res);
                this.dispatch(seigniorageRedux.actions.proposals_update({[i]: {
                    'maker': res.maker,
                    'stake': thousands(weiToMNTY(res.stake)),
                    'amount': thousands(weiToNUSD(res.amount)),
                    'slashingDuration': res.slashingDuration,
                    'lockdownExpiration': res.lockdownExpiration,
                }}));
                methods.totalVote(res.maker).call().then(totalVote => {
                    console.log(totalVote);
                    this.dispatch(seigniorageRedux.actions.proposals_update({[i]: {
                        'totalVote': totalVote,
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
            let mnty = res[orderType ? 2 : 1];
            let nusd = res[orderType ? 1 : 2];
            const order = {
                'seq': i,
                'id': id,
                'maker': cutString(res[0]),
                'amount': thousands(weiToMNTY(mnty)),
                'price': thousands(weiToPrice(mnty, nusd)),
            };
            if (orderType) {
                this.dispatch(seigniorageRedux.actions.bids_update({[i]: order}));
            } else {
                this.dispatch(seigniorageRedux.actions.asks_update({[MAX_ITEMS-1-i]: order}));
            }
            id = res[4];
        }
    }

    async reload() {
        this.loadOrders(true)
        this.loadOrders(false)
    }
}
