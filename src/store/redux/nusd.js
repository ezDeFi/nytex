import BaseRedux from '@/model/BaseRedux';

class NusdRedux extends BaseRedux {
    defineTypes() {
        return ['nusd'];
    }

    defineDefaultState() {
        return {
            nusdBalance: 0
        };
    }
}

export default new NusdRedux()
