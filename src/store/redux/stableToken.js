import BaseRedux from '@/model/BaseRedux';

class StableTokenRedux extends BaseRedux {
    defineTypes() {
        return ['stableToken'];
    }

    defineDefaultState() {
        return {
        };
    }
}

export default new StableTokenRedux()
