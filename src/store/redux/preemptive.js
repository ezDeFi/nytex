import BaseRedux from '@/model/BaseRedux'

class PreemptiveRedux extends BaseRedux {
  defineTypes () {
    return ['preemptive']
  }

  defineDefaultState () {
    return {
      proposal: ''
    }
  }
}

export default new PreemptiveRedux()