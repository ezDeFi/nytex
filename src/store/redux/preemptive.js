import BaseRedux from '@/model/BaseRedux'

class PreemptiveRedux extends BaseRedux {
  defineTypes () {
    return ['preemptive']
  }

  defineDefaultState () {
    return {
      detail_vote: ''
    }
  }
}

export default new PreemptiveRedux()
