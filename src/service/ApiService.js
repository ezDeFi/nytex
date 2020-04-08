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
        that.dispatch(commonRedux.actions.ntyQuote_update(response.data.data[2714].quote.USD))
      })
  }

  loadHistoricalData(callback) {
    var stateTime = new Date('2019-01-01').getTime()
    var curTime = new Date().getTime()
    axios.get('https://web-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/historical',
      {
        params : {
          convert:'USD',
          slug: 'nexty',
          time_end: curTime,
          time_start: stateTime
        },
        headers: {'Accept': 'application/json'}
      })
      .then(function (response) {
        let data = response.data.data.quotes
        let result = []
        for(let i in data) {
          let historical = {
            time: data[i].time_open,
            open: data[i].quote.USD.open,
            high: data[i].quote.USD.high,
            low: data[i].quote.USD.low,
            close: data[i].quote.USD.close,
            volume: data[i].quote.USD.volume
          }
          result.push(historical)
        }
        callback(result)
      })
  }
}