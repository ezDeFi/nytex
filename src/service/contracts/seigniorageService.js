import BaseService from '../../model/BaseService'
import _ from 'lodash'
import { empty } from 'glamor';
import { cutString, weiToMNTY, weiToEthS} from './help'
import { DECIMALS } from '@/constant'

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

    async getOrder(_orderType, _id) {
        const store = this.store.getState()
        let methods = store.contracts.seigniorage.methods
        let res = await methods.getOrder(_orderType, _id).call()
        let weiMNTY = _orderType ? BigNumber(await res[2]) : BigNumber(await res[1])
        weiMNTY = weiMNTY.toFixed(0)
        // console.log('weiMNTY', weiMNTY)
        let weiNUSD = _orderType ? BigNumber(await res[1]) : BigNumber(await res[2])
        weiNUSD = weiNUSD.toFixed(0)
        let amount = weiToMNTY(await weiMNTY)
        // let price = NUSDs / 1 MNTY = (weiNUSD / 1e18) / (weiMNTY / 1e24) = 1e6 * weiNUSD / weiMNTY
        let wPrice = BigNumber(await weiNUSD).multipliedBy(BigNumber(10).pow(DECIMALS.mnty)).div(await weiMNTY).div(BigNumber(10).pow(DECIMALS.nusd)) // weiNUSD / 1 MNTY
        // let expo = BigNumber(10).pow(DECIMALS.nusd)
        // let _before = BigNumber(wPrice).div(expo)
        // let _after = BigNumber(wPrice).mod(expo)
        // let price = _before.toString() + '.' + _after.toString()
        let price = wPrice.toFixed(10)
        let order = await {
            'id': _id,
            'maker': cutString(res[0]),
            'amount': amount,
            'price' : price,
            'haveAmount': res[1],
            'wantAmount': res[2],
            'prev': res[3],
            'next': res[4]}
        return await order
    }

    async loadOrders(_orderType) {
        const seigniorageRedux = this.store.getRedux('seigniorage')
        let orders = []
        const byteZero = '0x0000000000000000000000000000000000000000000000000000000000000000'
        const byteFFFF = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        let _id = byteZero
        let order = await this.getOrder(_orderType, _id)
        let next = order.next
        let loop = 10
        for (let i = 0; i < loop; ++i) {
            if (next === byteFFFF) {
              break;
            }
            // await console.log('orderId', _id, 'next', next)
            _id = next
            order = await this.getOrder(_orderType, _id)
            //await this.addOrderToRedux(_orderType, order)
            orders.push(order)
            next = order.next
        }
        await console.log('ABCD', orders)
        let orderNull = await this.getOrder(_orderType, byteZero)
        await console.log('order Zero', orderNull)
        //orders = await orders.sort((a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0))
        if (_orderType) {
            await this.dispatch(seigniorageRedux.actions.orders_update({'true': orders}))
        } else {
            await this.dispatch(seigniorageRedux.actions.orders_update({'false': orders.reverse()}))
        }
    }

    async reload () {
        const seigniorageRedux = this.store.getRedux('seigniorage')
        this.dispatch(seigniorageRedux.actions.orders_reset())
        this.loadOrders(true)
        this.loadOrders(false)
    }
}
