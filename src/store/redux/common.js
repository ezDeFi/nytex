import BaseRedux from '@/model/BaseRedux'

class CommunityRedux extends BaseRedux {
  defineTypes () {
    return ['common']
  }

  defineDefaultState () {
    return {
      ntyQuote: {}
    }
  }
}

export default new CommunityRedux()
