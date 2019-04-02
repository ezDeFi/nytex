import BaseRedux from '@/model/BaseRedux';

class WntyRedux extends BaseRedux {
    defineTypes() {
        return ['wnty'];
    }

    defineDefaultState() {
        return {
            wntyBalance: 0,
            address: 0x0,
        };
    }
}

export default new WntyRedux()
