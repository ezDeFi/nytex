import BaseRedux from '@/model/BaseRedux';

class TransactionRedux extends BaseRedux {
    defineTypes() {
        return ['transaction'];
    }

    defineDefaultState() {
        return {
            loading: false,
            list: [],
            detail: {}
        };
    }
}

export default new TransactionRedux()
