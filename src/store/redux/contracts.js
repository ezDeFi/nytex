import BaseRedux from '@/model/BaseRedux'

class ContractRedux extends BaseRedux {
  defineTypes () {
    return ['contracts']
  }

  defineDefaultState () {
    return {
      web3: null,
      readWrite: null,
      volatileToken: null,
      stableToken: null,
      seigniorage: null
    }
  }
}

export default new ContractRedux()
