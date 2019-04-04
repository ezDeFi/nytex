import BaseRedux from '@/model/BaseRedux';

class UserRedux extends BaseRedux {
    defineTypes() {
        return ['user'];
    }

    defineDefaultState() {
        return {
            loading: false,

            is_login: false,
            is_leader: false,
            is_admin: false,

            isCitizen: null,
            email: '',
            username: '',
            messages: [],

            role: '',
            countPlay: 0,
            walletBalance: 0,
            nusdBalance: 0,
            wntyBalance: 0,
            balance: 0,
            walletAddress: '',
            refAddress: '',
            refUsername: '',
            // TODO: I think we scrap this
            login_form: {
                username: '',
                password: '',
                loading: false
            },
            showRegisterModal: false,

            // TODO: I think we scrap this
            register_form: {
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            },

            profile: {

            },
            current_user_id: null
        };
    }
}

export default new UserRedux()
