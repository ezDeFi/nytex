import BaseService from '../model/BaseService'
import axios                        from 'axios'

export default class extends BaseService {
  loadNtyQuote() {
    const that = this
    const commonRedux = this.store.getRedux('common')
    axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
      {
        params : {id: 2714},
        headers: {'X-CMC_PRO_API_KEY': '64d67fb5-c596-4af9-8a2b-bb60c0dba70d', 'Accept': 'application/json'}
      })
      .then(function (response) {
        console.log(response.data.data[2714].quote.USD)
        that.dispatch(commonRedux.actions.ntyQuote_update(response.data.data[2714].quote.USD))
      })
  }
}