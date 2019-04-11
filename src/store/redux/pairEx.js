import BaseRedux from '@/model/BaseRedux';

class PairExRedux extends BaseRedux {
    defineTypes() {
        return ['pairEx'];
    }

    defineDefaultState() {
        return {
        };
    }
}

export default new PairExRedux()
