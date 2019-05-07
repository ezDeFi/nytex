import BaseService from '../../model/BaseService'
import _ from 'lodash'
import { empty } from 'glamor';
import { cutString, weiToMNTY, weiToEthS} from './help'
import { DECIMALS } from '@/constant'

var BigNumber = require('big-number');

export default class extends BaseService {
    async sellVolatileToken(haveAmount, wantAmount) {
        console.log(haveAmount.toString(), wantAmount.toString())
        return
    }

    async sellStableToken(haveAmount, wantAmount) {
    return
    }

    async getOrder(_orderType, _id) {
        const store = this.store.getState()
        let methods = store.contracts.pairEx.methods
        let res = await methods.getOrder(_orderType, _id).call()
        let weiMNTY = _orderType ? BigNumber(await res[2]) : BigNumber(await res[1])
        let weiNUSD = _orderType ? BigNumber(await res[1]) : BigNumber(await res[2])
        let amount = weiToMNTY(await weiMNTY)
        // let price = NUSDs / 1 MNTY = (weiNUSD / 1e18) / (weiMNTY / 1e24) = 1e6 * weiNUSD / weiMNTY
        let wPrice = BigNumber(await weiNUSD).multiply(BigNumber(10).power(DECIMALS.mnty)).div(await weiMNTY) // weiNUSD / 1 MNTY
        let expo = BigNumber(10).power(DECIMALS.nusd)
        let _before = BigNumber(wPrice).div(expo)
        let _after = BigNumber(wPrice).mod(expo)
        let price = _before.toString() + '.' + _after.toString()
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
        const pairExRedux = this.store.getRedux('pairEx')
        let orders = []
        let byteZero = '0x0000000000000000000000000000000000000000000000000000000000000000'
        let _id = byteZero
        let order = await this.getOrder(_orderType, _id)
        let prev = await order.prev
        let loop = 10
        while ((await prev !== byteZero)) {
            // await console.log('orderId', _id, 'prev', prev)
            _id = await prev
            order = await this.getOrder(_orderType, _id)
            //await this.addOrderToRedux(_orderType, order)
            await orders.push(order)
            prev = await order.prev
            await loop--
        }
        await console.log('ABCD', orders)
        //orders = await orders.sort((a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0))
        if (_orderType) {
            await this.dispatch(pairExRedux.actions.orders_update({'true': orders.reverse()}))
        } else {
            await this.dispatch(pairExRedux.actions.orders_update({'false': orders}))
        }
    }

    async reload () {
        const pairExRedux = this.store.getRedux('pairEx')
        await this.dispatch(pairExRedux.actions.orders_reset())
        await this.loadOrders(true)
        await this.loadOrders(false)
    }
}
