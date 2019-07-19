import BaseRedux from '@/model/BaseRedux';

class SeigniorageRedux extends BaseRedux {
    defineTypes () {
        return ['seigniorage'];
    }

    defineDefaultState () {
        return {
            bids: {
                // 0: {
                //     id: '0xxxxxxcba1eb33dc4b8c6dcbfcc6352f0a253285d',
                //     address: '0x95e2fcba1eb33dc4b8c6dcbfcc6352f0a253285d',
                //     amount: 10,
                //     price: 20
                // },
            },
            asks: {

            },

        };
    }
}

export default new SeigniorageRedux()
