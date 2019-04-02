import BaseRedux from '@/model/BaseRedux';

class ReferRedux extends BaseRedux {
    defineTypes() {
        return ['refer'];
    }

    defineDefaultState() {
        return {
            loading: false,
            list: [],
            detail: {}
        };
    }
}

export default new ReferRedux()
