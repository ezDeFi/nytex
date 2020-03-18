import BaseRedux from '@/model/BaseRedux'

class PreemptiveRedux extends BaseRedux {
  defineTypes () {
    return ['preemptive']
  }

  defineDefaultState () {
    return {
      detailVote: ''
    }
  }
}

export default new PreemptiveRedux()
