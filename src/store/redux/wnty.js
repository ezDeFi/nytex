import BaseRedux from '@/model/BaseRedux';

class WntyRedux extends BaseRedux {
    defineTypes() {
        return ['volatileToken'];
    }

    defineDefaultState() {
        return {
            volatileTokenBalance: 0,
            address: 0x0,
        };
    }
}

export default new WntyRedux()
