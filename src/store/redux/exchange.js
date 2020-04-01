import BaseRedux from '@/model/BaseRedux'

class PreemptiveRedux extends BaseRedux {
  defineTypes() {
    return ['exchange']
  }

  defineDefaultState() {
    return {
      priceToSell: 0,
      priceToBuy : 0
    }
  }
}

export default new PreemptiveRedux()
