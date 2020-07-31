import BaseRedux from '@/model/BaseRedux';

class GovernanceRedux extends BaseRedux {
    defineTypes () {
        return ['governance'];
    }

    defineDefaultState () {
        return {
        };
    }
}

export default new GovernanceRedux()
