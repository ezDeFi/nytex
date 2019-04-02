import {createContainer} from '@/util';
import Component from './Component';
import UserService from '@/service/UserService';
import LanguageService from '@/service/LanguageService';
import {message} from 'antd';

export default createContainer(Component, (state) => {
    return {
        isLogin: state.user.is_login,
        role: state.user.role,
        profile: state.user.profile,
        username: state.user.username,
        language: state.language,
        pathname: state.router.location.pathname,
        showRegisterModal: state.user.showRegisterModal,
        user: state.user
    };
}, () => {
    const userService = new UserService();
    const languageService = new LanguageService();
    return {
        async logout() {
            const rs = await userService.logout();
            if (rs) {
                message.success('Logout success');
            }
        },
        changeLanguage(lang) {
            languageService.changeLanguage(lang);
        },
        toggleRegisterModal(toggle) {
            userService.toggleRegisterModal(toggle)
        },
        async getWalletBalance() {
            return userService.getWalletBalance()
        },
    };
});
