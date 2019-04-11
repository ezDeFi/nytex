import {createContainer} from '@/util';
import Component from './Component';
import UserService from '@/service/UserService';
import SocketService from '@/service/SocketService';
import {message} from 'antd';

export default createContainer(Component, (state) => {
    return {
        user: state.user,
        socket: state.socket.event,
        is_login: state.user.is_login
    };
}, () => {
    const userService = new UserService()
    const socketService = new SocketService()

    return {
        async getMessages(param) {
            return userService.getMessages(param)
        },
        async emitMessage(param) {
            return socketService.emitMessage(param)
        },
        toggleRegisterModal(toggle) {
            userService.toggleRegisterModal(toggle)
        }
    };
});
