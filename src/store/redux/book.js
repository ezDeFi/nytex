import BaseRedux from '@/model/BaseRedux';

class BookRedux extends BaseRedux {
    defineTypes() {
        return ['book'];
    }

    defineDefaultState() {
        return {
            orders: {
                'true': [],
                'false': []
            }
        };
    }
}

export default new BookRedux()
