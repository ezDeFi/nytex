import BaseService from '../../model/BaseService'
import _ from 'lodash'
import { empty } from 'glamor';

export default class extends BaseService {
    async getOrder(_orderType, _id) {
        const bookRedux = this.store.getRedux('book')
        const store = this.store.getState()
        let methods = store.contract.book.methods
        let wallet = store.user.walletAddress
        let res = await methods.getOrder(_orderType, _id).call()
        let order = {
            'id': _id,
            'maker': res[0],
            'haveAmount': res[1],
            'wantAmount': res[2],
            'prev': res[3],
            'next': res[4]}
        //await this.dispatch(userRedux.actions.stableTokenBalance_update(_stableTokenBalance))
        return await order
    }

    async addOrderToRedux(_orderType, _order) {
        const bookRedux = this.store.getRedux('book')
        const store = this.store.getState()
        let orders = _orderType ? store.book.orders.true : store.book.orders.false
        orders.push(_order)
        if (_orderType) {
            await this.dispatch(bookRedux.actions.orders_update({true: orders}))
        } else {
            await this.dispatch(bookRedux.actions.orders_update({false: orders}))
        }
    }

    async getOrders(_orderType) {
        const bookRedux = this.store.getRedux('book')
        let orders = []
        let byteZero = '0x0000000000000000000000000000000000000000000000000000000000000000'
        let _id = byteZero
        let order = await this.getOrder(_orderType, _id)
        let prev = await order.prev
        let loop = 10
        while ((await prev !== byteZero) && (loop > 0)) {
            await console.log('orderId', _id, 'prev', prev)
            _id = await prev
            order = await this.getOrder(_orderType, _id)
            //await this.addOrderToRedux(_orderType, order)
            await orders.push(order)
            prev = await order.prev
            await loop--
        }
        await console.log('ABCD', orders)
        if (_orderType) {
            await this.dispatch(bookRedux.actions.orders_update({'true': orders}))
        } else {
            await this.dispatch(bookRedux.actions.orders_update({'false': orders}))
        }
    }

    async reload() {
        const bookRedux = this.store.getRedux('book')
        await this.dispatch(bookRedux.actions.orders_update({'true': empty, 'false': empty}))
        await this.getOrders(true)
        await this.getOrders(false)
    }

    async remove(_orderType, _id) {
        const store = this.store.getState()
        let methods = store.contract.book.methods
        let wallet = store.user.walletAddress
        return await methods.remove(_orderType, _id).send({from : wallet})
    }
}
