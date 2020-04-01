import BaseRedux from '@/model/BaseRedux';

class SeigniorageRedux extends BaseRedux {
  defineTypes() {
    return ['seigniorage'];
  }

  defineDefaultState() {
    return {
      bids: [],
      asks: {},

      proposals: {
        // 0: {
        //     maker: '0xxxxxxcba1eb33dc4b8c6dcbfcc6352f0a253285d',
        //     stake: 345,
        //     amount: 123,
        //     slashingRate: 13,
        //     lockdownExpiration: 39,
        // },
        // 1: {
        //     maker: '0x12345cba1eb33dc4b8c6dcbfcc6352f0a253285d',
        //     stake: 345000,
        //     amount: 123000,
        //     slashingRate: 130,
        //     lockdownExpiration: 390,
        // },
      },

      globalParams: {
        // stake: 0,
        // slashingRate: 0,
        // lockdownExpiration: 0,
        // rank: 0,
      },

      lockdown: {},
    };
  }
}

export default new SeigniorageRedux()
