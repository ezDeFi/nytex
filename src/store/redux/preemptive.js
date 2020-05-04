import BaseRedux from '@/model/BaseRedux'

class PreemptiveRedux extends BaseRedux {
  defineTypes () {
    return ['preemptive']
  }

  defineDefaultState () {
    return {
      showingProposal: '',
      userProposal: ''
    }
  }
}

export default new PreemptiveRedux()
