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

            proposals: {
                // 0: {
                //     maker: '0xxxxxxcba1eb33dc4b8c6dcbfcc6352f0a253285d',
                //     stake: 345,
                //     amount: 123,
                //     slashingDuration: 13,
                //     lockdownExpiration: 39,
                // },
                // 1: {
                //     maker: '0x12345cba1eb33dc4b8c6dcbfcc6352f0a253285d',
                //     stake: 345000,
                //     amount: 123000,
                //     slashingDuration: 130,
                //     lockdownExpiration: 390,
                // },
            },
        };
    }
}

export default new SeigniorageRedux()
