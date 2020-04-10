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


  loadTradeHistories(callback) {
    axios.get('http://51.158.123.17:8881/gettrade',
      {
        headers: {'Accept': 'application/json'}
      })
      .then(function (response) {
        let data = response.data;
        // console.log(data)
        let result = data.map((record) => {
          let price, amount
          let wantAmount = parseFloat(record.wantAnount.split(' ')[0])
          let haveAmount = parseFloat(record.haveAmount.split(' ')[0])
          console.log(record.wantAnount.split(' ')[1].toLowerCase())
          let status = record.wantAnount.split(' ')[1].toLowerCase() === 'newsd' ? 'sell' : 'buy'
          if(status === 'buy') {
            price = haveAmount/wantAmount
            amount = wantAmount
          } else {
            price = wantAmount/haveAmount
            amount = haveAmount
          }
          return {
            key: record._id,
            price: [price, status],
            amount: amount,
            time: record.time
          }
        })
        callback(result)
      })
  }

}