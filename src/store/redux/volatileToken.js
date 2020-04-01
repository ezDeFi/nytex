import BaseRedux from '@/model/BaseRedux';

class VolatileTokenRedux extends BaseRedux {
    defineTypes() {
        return ['volatileToken'];
    }

    defineDefaultState() {
        return {
        };
    }
}

export default new VolatileTokenRedux()
