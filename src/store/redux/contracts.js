import BaseRedux from '@/model/BaseRedux'

class ContractRedux extends BaseRedux {
  defineTypes () {
    return ['contracts']
  }

  defineDefaultState () {
    return {
      web3: null,
      volatileToken: null,
      stableToken: null,
      pairEx: null
    }
  }
}

export default new ContractRedux()
