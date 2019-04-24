import {createContainer, goPath} from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import CitizenService from '@/service/contracts/CitizenService'
import {message} from 'antd'

message.config({
    top: 100
})

/**
 * Note at the moment we do lazy client side registration code generation
 * TODO: move this to server side
 */
export default createContainer(Component, (state) => {
    return {
        ...state.user.register_form,
        language: state.language,
        walletAddress: state.user.walletAddress
    }
}, () => {
    const userService = new UserService()
    const citizenService = new CitizenService()

    return {
        async register(email, username, walletAddress) {
            try {
                const rs = await userService.registerByMetamask(email, username, walletAddress)

                if (rs) {
                    message.success('Register success')
                    const registerRedirect = sessionStorage.getItem('registerRedirect')

                    if (registerRedirect) {
                        return true;
                    } else {
                        this.history.push('/')
                    }
                }
            } catch (err) {
                console.error(err)
                message.error(err && err.message ? err.message : 'Registration Failed - Please Contact Our Support')
            }
        },

        async sendEmail(toUserId, formData) {
            return userService.sendEmail(this.currentUserId, toUserId, formData)
        },

        async sendRegistrationCode(email, code) {
            return userService.sendRegistrationCode(email, code)
        },

        async checkEmail(email) {
            try {
                await userService.checkEmail(email)
                return false
            } catch (err) {
                return true
            }
        },

        async checkWallet(walletAddress) {
            try {
                await userService.checkWallet(walletAddress)
                return false
            } catch (err) {
                return true
            }
        },

        async checkUsername(username) {
            try {
                await userService.checkUsername(username)
                return false
            } catch (err) {
                return true
            }
        },

        registerOnChange(username, referAddress) {
            return citizenService.register(username, referAddress)
        },
        isCitizen() {
            return citizenService.isCitizen()
        }
    }
})
