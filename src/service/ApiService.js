import BaseService from '../model/BaseService'
import axios       from 'axios'

export default class extends BaseService {
  loadNtyQuote() {
    const that        = this
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
    var curTime   = new Date().getTime()
    axios.get('https://web-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/historical',
      {
        params : {
          convert   : 'USD',
          slug      : 'nexty',
          time_end  : curTime,
          time_start: stateTime
        },
        headers: {'Accept': 'application/json'}
      })
      .then(function (response) {
        let data   = response.data.data.quotes
        let result = []
        for (let i in data) {
          let historical = {
            time  : data[i].time_open,
            open  : data[i].quote.USD.open,
            high  : data[i].quote.USD.high,
            low   : data[i].quote.USD.low,
            close : data[i].quote.USD.close,
            volume: data[i].quote.USD.volume
          }
          result.push(historical)
        }
        callback(result)
      })
  }


  loadTradeHistories(callback) {
    axios.get('http://51.158.123.17:8881/gettoptrade',
      {
        headers: {'Accept': 'application/json'}
      })
      .then(function (response) {
        let data   = response.data;
        // console.log(data)
        let result = data.map((record) => {
          let price, amount
          let wantAmount = parseFloat(record.wantAmount.split(' ')[0])
          let haveAmount = parseFloat(record.haveAmount.split(' ')[0])
          let status     = record.wantAmount.split(' ')[1].toLowerCase() === 'newsd' ? 'sell' : 'buy'
          if (status === 'buy') {
            price  = haveAmount / wantAmount
            amount = wantAmount
          } else {
            price  = wantAmount / haveAmount
            amount = haveAmount
          }
          return {
            key   : record._id,
            price : [price, status],
            amount: amount,
            time  : record.time
          }
        })
        callback(result)
      })
  }

  loadOpenOrder(setOpenOrder, address, timeFrom = null, timeTo = null) {
    if(!timeTo && !timeFrom) {
      timeTo = parseInt(new Date().getTime() / 1000)
      timeFrom = timeTo - 24*60*60
    }

    var that = this
    axios.get('http://51.158.123.17:8881/get-open-order',
      {
        headers: {'Accept': 'application/json'},
        params: {
          address: address,
          from: timeFrom,
          to: timeTo
        }
      })
      .then(function (response) {
        let data   = response.data;
        let result = data.map((record) => {
          const {price, amount, total, side, filled} = that.convertOrderData(record.wantAmount, record.haveAmount, record.haveAmountNow)
          return {
            key    : record._id,
            maker  : record.address,
            id  : record.orderID,
            price  : price,
            amount : amount,
            time   : record.time,
            total  : total,
            side   : side,
            filled : filled,
            trigger: '-'
          }
        })
        setOpenOrder(result)
      })
  }

  loadOpenHistory(setOpenHistory, address, timeFrom = null, timeTo = null) {
    if(!timeTo && !timeFrom) {
      timeTo = parseInt(new Date().getTime() / 1000)
      timeFrom = timeTo - 24*60*60
    }

    var that = this
    axios.get('http://51.158.123.17:8881/get-open-history',
      {
        headers: {'Accept': 'application/json'},
        params: {
          address: address,
          from: timeFrom,
          to: timeTo
        }
      })
      .then(function (response) {
        let data   = response.data;
        let result = data.map((record) => {

          const {price, amount, total, side, filled} = that.convertOrderData(record.wantAmount, record.haveAmount, record.haveAmountNow)
          return {
            key    : record._id,
            maker  : record.address,
            id  : record.orderID,
            price  : price,
            amount : amount,
            time   : record.time,
            total  : total,
            side   : side,
            filled : filled,
            trigger: '-',
            average: '-',
            status: record.status
          }
        })
        setOpenHistory(result)
      })
  }

  loadTradeHistory(setTradeHistory, address, timeFrom = null, timeTo = null) {
    if(!timeTo && !timeFrom) {
      timeTo = parseInt(new Date().getTime() / 1000)
      timeFrom = timeTo - 24*60*60
    }
    var that = this
    axios.get('http://51.158.123.17:8881/get-trade-history',
      {
        headers: {'Accept': 'application/json'},
        params: {
          address: address,
          from: timeFrom,
          to: timeTo
        }
      })
      .then(function (response) {
        let data   = response.data;
        let result = data.map((record) => {
          const {price, amount, total, side, filled} = that.convertOrderData(record.wantAmount, record.haveAmount, record.haveAmountNow)
          return {
            key    : record._id,
            market: 'MNTY/NEWSD',
            time   : record.time,
            price  : price,
            total  : total,
            side   : side,
            filled : filled,
            txfee: '-'
          }
        })
        setTradeHistory(result)
      })
  }

  convertOrderData(_wantAmount, _haveAmount, _haveAmountNow = null) {
    let price, amount, volume, filled

    let wantAmount    = parseFloat(_wantAmount.split(' ')[0])
    let haveAmount    = parseFloat(_haveAmount.split(' ')[0])
    let haveAmountNow = parseFloat(_haveAmountNow.split(' ')[0])

    let status = _wantAmount.split(' ')[1].toLowerCase() === 'newsd' ? 'sell' : 'buy'
    if (status === 'buy') {
      price  = haveAmount / wantAmount
      amount = wantAmount
      volume = haveAmount
    } else {
      price  = wantAmount / haveAmount
      amount = haveAmount
      volume = wantAmount
    }
    filled = (1 - (haveAmountNow / haveAmount)) * 100
    return {
      price : price,
      amount: amount,
      total : volume,
      side  : status,
      filled: filled,
    }
  }

}