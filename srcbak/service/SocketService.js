import BaseService from '../model/BaseService'
import _ from 'lodash'
import {api_request} from '@/util';

export default class extends BaseService {
    async initEvent(socket) {
        const socketRedux = this.store.getRedux('socket')
        const userRedux = this.store.getRedux('user')

        await this.dispatch(socketRedux.actions.event_update(socket))

        socket.on('updateRoomsList', (data) => {
            console.log('updateRoomsList', data)
        })

        socket.on('addMessage', async (data) => {
            const store = this.store.getState().user
            const messages = store.messages
            messages.push(data)

            await this.dispatch(userRedux.actions.messages_update(messages))
        })
    }

    async emitMessage(param) {
        const socketRedux = this.store.getRedux('socket')
        const userRedux = this.store.getRedux('user')
        const storeUser = this.store.getState().user
        const storeSocket = this.store.getState().socket

        storeSocket.event.emit('newMessage', param)
        const messages = storeUser.messages
        messages.push({
            text: param.message,
            user: storeUser
        })

        await this.dispatch(userRedux.actions.messages_update(messages))
    }
}
