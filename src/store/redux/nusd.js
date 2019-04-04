import BaseRedux from '@/model/BaseRedux';

class NusdRedux extends BaseRedux {
    defineTypes() {
        return ['stableToken'];
    }

    defineDefaultState() {
        return {
            stableTokenBalance: 0
        };
    }
}

export default new NusdRedux()
