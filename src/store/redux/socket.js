import BaseRedux from '@/model/BaseRedux';

class socketRedux extends BaseRedux {
    defineTypes() {
        return ['socket'];
    }

    defineDefaultState() {
        return {
            event: {},
            users: []
        };
    }
}

export default new socketRedux()
