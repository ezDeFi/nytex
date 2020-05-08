import BaseService                 from '../model/BaseService'
import axios                       from 'axios'
import {div, mntyToWei, nusdToWei, thousands, weiToPrice} from '@/util/help'
import web3                        from "web3";

const API_URL = 'http://51.158.123.17:8881'
const API = {
  GET_OPEN_ORDER: API_URL + '/get-open-order',
  GET_OPEN_HISTORY: API_URL + '/get-open-history',
  GET_TRADE_HISTORY: API_URL + '/get-trade-history',
  GET_NEW_TRADE: API_URL + '/gettoptrade',
}

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
    var that = this
    var stateTime = new Date('2019-01-01').getTime()
    var curTime   = new Date().getTime()
    axios.get('http://51.158.123.17:8881/getcandle',
      {
        headers: {'Accept': 'application/json'}
      })
      .then(function (response) {
        let data   = response.data
        let result = []
        for (let i in data) {

          let historical = {
            time  : data[i].time,
            open  : data[i].open,
            high  : data[i].hight,
            low   : data[i].low,
            close : data[i].close ,
            volume: data[i].volume
          }
          result.push(historical)
        }
        callback(result)
      })
  }

  loadTradeHistories(callback) {
    var that = this
    axios.get(API.GET_NEW_TRADE,
      {
        headers: {'Accept': 'application/json'}
      })
      .then(function (response) {
        let data   = response.data;
        let result = data.map((record) => {
          let price, amount
          let wantAmount = parseFloat(record.wantAmount.split(' ')[0])
          let haveAmount = parseFloat(record.haveAmount.split(' ')[0])
          let status     = record.wantAmount.split(' ')[1].toLowerCase() === 'newsd' ? 'sell' : 'buy'
          if (status === 'buy') {
            price  =   thousands(weiToPrice(mntyToWei(wantAmount), nusdToWei(haveAmount)))
            amount = wantAmount
          } else {
            price  = thousands(weiToPrice(mntyToWei(haveAmount), nusdToWei(wantAmount)))
            amount = haveAmount
          }
          return {
            key   : record._id,
            price : [price, status],
            amount: amount,
            time  : that.timestampToTime(record.time),
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
    axios.get(API.GET_OPEN_ORDER,
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
            time   : that.timestampToDateTime(record.time),
            total  : total,
            side   : that.upperCaseFirstLetter(side),
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
    axios.get(API.GET_OPEN_HISTORY,
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
            time   : that.timestampToDateTime(record.time),
            total  : total,
            side   : that.upperCaseFirstLetter(side),
            filled : filled,
            trigger: '-',
            average: '-',
            status: that.upperCaseFirstLetter(record.status)
          }
        })
        setOpenHistory(result)
      })
  }

  timestampToTime(timestamp) {
    let date = new Date(timestamp * 1000)
    return this.pad(date.getHours()) + ':' + this.pad(date.getMinutes()) + ':' + this.pad(date.getSeconds());
  }

  timestampToDateTime(timestamp) {
    let date = new Date(timestamp * 1000)
    let month =   this.pad(date.getMonth() + 1)
    return month +'-'+ this.pad(date.getDate()) + ' ' + this.pad(date.getHours()) + ':' + this.pad(date.getMinutes()) + ':' + this.pad(date.getSeconds());
  }

  pad(num) {
    return ('0' + num).slice(-2)
  }

  upperCaseFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  loadTradeHistory(setTradeHistory, address, timeFrom = null, timeTo = null) {
    if(!timeTo && !timeFrom) {
      timeTo = parseInt(new Date().getTime() / 1000)
      timeFrom = timeTo - 24*60*60
    }
    var that = this
    axios.get(API.GET_TRADE_HISTORY,
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
            time   : that.timestampToDateTime(record.time),
            price  : price,
            total  : total,
            side   : that.upperCaseFirstLetter(side),
            filled : filled,
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
      price  = thousands(weiToPrice(mntyToWei(wantAmount), nusdToWei(haveAmount)))
      amount = wantAmount
      volume = haveAmount
    } else {
      price  = thousands(weiToPrice(mntyToWei(haveAmount), nusdToWei(wantAmount)))
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