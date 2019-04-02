import BaseService from '../model/BaseService'
import _ from 'lodash'
import {USER_ROLE} from '@/constant'
import {api_request} from '@/util';
import io from 'socket.io-client'
import SocketService from '@/service/SocketService'

export default class extends BaseService {
    async getWalletBalance() {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let wallet = store.user.walletAddress
        if (!wallet ) {
            return
        }
        let walletBalance = await store.contract.lib.web3.eth.getBalance(wallet)
        await this.dispatch(userRedux.actions.walletBalance_update(walletBalance / 1e18))
        return walletBalance
    }

    async login(username, password, persist) {
        // call API /login
        const res = await api_request({
            path: '/api/user/login',
            method: 'get',
            data: {
                username,
                password
            }
        });

        return this.setLogged(res, persist)
    }


    //**
    // data: email, username, walletAddress
    // **
    async registerByMetamask(email, username, walletAddress) {
        // call API /login
        const res = await api_request({
            path: '/api/user/auth_metamask',
            method: 'post',
            data: {
                email,
                username,
                walletAddress
            }
        });

        return this.setLogged(res, true)
    }

    async toggleRegisterModal(toggle) {
        const userRedux = this.store.getRedux('user')
        await this.dispatch(userRedux.actions.showRegisterModal_update(toggle))
    }

    async loginByMetamask(walletAddress) {
        // call API /login
        const res = await api_request({
            path: '/api/user/auth_metamask',
            method: 'post',
            data: {
                walletAddress
            }
        });

        return this.setLogged(res, true)
    }

    async checkUserExists(walletAddress) {
        const res = await api_request({
            path: '/api/user/check_user_exists',
            method: 'post',
            data: {
                walletAddress
            }
        });

        return res
    }

    async setLogged(res, persist) {
        const userRedux = this.store.getRedux('user')
        await this.dispatch(userRedux.actions.login_form_reset())

        await this.dispatch(userRedux.actions.is_login_update(true))

        if ([USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(res.user.role)) {
            await this.dispatch(userRedux.actions.is_admin_update(true))
        }else{
            await this.dispatch(userRedux.actions.is_admin_update(false))
        }
        if ([USER_ROLE.LEADER].includes(res.user.role)) {
            await this.dispatch(userRedux.actions.is_leader_update(true))
        }else {
            await this.dispatch(userRedux.actions.is_leader_update(false))
        }

        await this.dispatch(userRedux.actions.email_update(res.user.email))
        // await this.dispatch(userRedux.actions.balance_update(res.balance))
        await this.dispatch(userRedux.actions.countPlay_update(res.countPlay))
        await this.dispatch(userRedux.actions.username_update(res.user.username))
        await this.dispatch(userRedux.actions.walletAddress_update(res.user.walletAddress))
        await this.dispatch(userRedux.actions.profile_update(res.user.profile))
        await this.dispatch(userRedux.actions.role_update(res.user.role))
        await this.dispatch(userRedux.actions.current_user_id_update(res.user._id))
        sessionStorage.setItem('api-token', res['api-token']);

        const socket = io.connect(process.env.SERVER_URL)
        const socketService = new SocketService()

        socket.on('connect', () => {
            socket.emit('join', {roomId: process.env.ROOM_ID, userId: res.user._id})
            console.log('process.env.ROOM_ID', process.env.ROOM_ID)
            socketService.initEvent(socket)
        })

        socket.on('error', function (err) {
          console.log('received socket error:')
          console.log(err)
        })

        if (persist) {
            localStorage.setItem('api-token', res['api-token'])
        } else {
            localStorage.removeItem('api-token')
        }

        return {
            success: true,
            is_admin: res.user.role === USER_ROLE.ADMIN
        }
    }

    async getMessages(param) {
        const userRedux = this.store.getRedux('user')

        const res = await api_request({
            path: '/api/user/messages',
            method: 'get',
            data: param
        })

        await this.dispatch(userRedux.actions.messages_update(res))
        return res
    }

    /**
     * Check if username already exists
     *
     * @param username
     * @returns {Promise<void>}
     */
    async checkUsername(username) {
        return await api_request({
            path: '/api/user/check-username',
            method: 'post',
            data: {
                username
            }
        });
    }

    async register(username, password, walletAddress, refer, profile) {

        const res = await api_request({
            path : '/api/user/register',
            method : 'post',
            data : Object.assign(profile, {
                username,
                password,
                walletAddress,
                refer
            })
        });

        return this.login(username, password)
    }

    async forgotPassword(email) {

        return api_request({
            path : '/api/user/forgot-password',
            method : 'post',
            data : {
                email
            }
        })
    }

    async resetPassword(resetToken, password) {

        return api_request({
            path : '/api/user/reset-password',
            method : 'post',
            data : {
                resetToken,
                password
            }
        })
    }

    async getCurrentUser() {
        const userRedux = this.store.getRedux('user')

        const data = await api_request({
            path: '/api/user/current_user'
        })

        this.dispatch(userRedux.actions.is_login_update(true));
        if ([USER_ROLE.LEADER].includes(data.role)) {
            this.dispatch(userRedux.actions.is_leader_update(true))
        } else {
            this.dispatch(userRedux.actions.is_leader_update(false))
        }
        if ([USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(data.role)) {
            this.dispatch(userRedux.actions.is_admin_update(true))
        } else {
            this.dispatch(userRedux.actions.is_admin_update(false))
        }
        this.dispatch(userRedux.actions.email_update(data.email))
        this.dispatch(userRedux.actions.balance_update(data.balance))
        this.dispatch(userRedux.actions.countPlay_update(data.countPlay))
        this.dispatch(userRedux.actions.username_update(data.username))
        this.dispatch(userRedux.actions.walletAddress_update(data.walletAddress))
        this.dispatch(userRedux.actions.profile_update(data.profile))
        this.dispatch(userRedux.actions.role_update(data.role))
        this.dispatch(userRedux.actions.current_user_id_update(data._id))

        this.dispatch(userRedux.actions.loading_update(false))

        return data
    }

    // restrictive getter - public profile should never return email / private info
    async getMember(userId, options = {}) {
        let path = `/api/user/public/${userId}`
        const memberRedux = this.store.getRedux('member')
        await this.dispatch(memberRedux.actions.loading_update(true))

        if (options.admin) {
            path += '?admin=true'
        }

        const result = await api_request({
            path: path,
            method: 'get'
        })

        await this.dispatch(memberRedux.actions.detail_update(result))
        await this.dispatch(memberRedux.actions.loading_update(false))

        return result
    }

    resetMemberDetail() {
        const memberRedux = this.store.getRedux('member')
        this.dispatch(memberRedux.actions.detail_reset())
    }

    async update(userId, doc) {

        const memberRedux = this.store.getRedux('member')

        await this.dispatch(memberRedux.actions.loading_update(true))

        const result = await api_request({
            path: `/api/user/${userId}`,
            method: 'put',
            data: doc
        })

        await this.dispatch(memberRedux.actions.detail_update(result))
        await this.dispatch(memberRedux.actions.loading_update(false))

        return result
    }

    async logout() {
        const userRedux = this.store.getRedux('user')
        const tasksRedux = this.store.getRedux('task')

        return new Promise((resolve) => {
            this.dispatch(userRedux.actions.is_login_update(false))
            this.dispatch(userRedux.actions.profile_reset())

            this.dispatch(userRedux.actions.is_admin_reset())
            this.dispatch(userRedux.actions.is_leader_reset())

            this.dispatch(userRedux.actions.email_reset())
            this.dispatch(userRedux.actions.balance_reset())
            this.dispatch(userRedux.actions.countPlay_reset())
            this.dispatch(userRedux.actions.walletAddress_reset())
            this.dispatch(userRedux.actions.username_reset())
            this.dispatch(userRedux.actions.profile_reset())
            this.dispatch(userRedux.actions.role_reset())
            this.dispatch(userRedux.actions.current_user_id_reset())

            this.dispatch(tasksRedux.actions.all_tasks_reset())
            sessionStorage.clear()
            localStorage.removeItem('api-token', '')
            resolve(true)
        })
    }

    async getByIds(ids) {
        const result = await api_request({
            path : `/api/user/${ids}/users`,
            method : 'get',
        });

        return result
    }

    async getAll(query) {
        const memberRedux = this.store.getRedux('member')
        await this.dispatch(memberRedux.actions.users_loading_update(true))

        const path = '/api/user/list'
        this.abortFetch(path)

        let result
        try {
            result = await api_request({
                path,
                method : 'get',
                data: query,
                signal: this.getAbortSignal(path)
            });

            await this.dispatch(memberRedux.actions.users_update(result.list))
            await this.dispatch(memberRedux.actions.users_total_update(result.total))
            await this.dispatch(memberRedux.actions.users_loading_update(false))
        } catch (e) {
            // Do nothing
        }

        return result
    }

    async sendEmail(fromUserId, toUserId, formData) {
        return await api_request({
            path: '/api/user/send-email',
            method: 'post',
            data: {
                fromUserId,
                toUserId,
                ...formData
            }
        })
    }

    async sendRegistrationCode(email, code) {
        return await api_request({
            path: '/api/user/send-code',
            method: 'post',
            data: {
                email,
                code // TODO dont send this in clear text
            }
        })
    }

    async sendConfirmationEmail(email) {
        return await api_request({
            path: '/api/user/send-confirm',
            method: 'post',
            data: {
                email
            }
        })
    }

    async checkEmail(email) {
        return await api_request({
            path: '/api/user/check-email',
            method: 'post',
            data: {
                email
            }
        })
    }

    async checkWallet(walletAddress) {
        return await api_request({
            path: '/api/user/check-wallet',
            method: 'post',
            data: {
                walletAddress
            }
        })
    }

    async checkUsername(username) {
        return await api_request({
            path: '/api/user/check-username',
            method: 'post',
            data: {
                username
            }
        })
    }
}
