import React, {useEffect, useState }         from 'react';
import {Row, Col, Table}          from 'antd'
import './style/index.scss'
import OrderBook                  from './orderBook'
import BuySell                    from './buySell'
import OpenOrder                  from './openOrder'
import BasePage                   from '../../page/StandardPage'
import Chart                      from './chart'
import SeigniorageService         from "../../../service/contracts/SeigniorageService";
import UserService                from "../../../service/UserService";
import VolatileTokenService       from "../../../service/contracts/VolatileTokenService";
import StableTokenService         from "../../../service/contracts/StableTokenService";
import {useSelector}              from "react-redux";
import {setupWeb3}                from '../../../util/auth'
import ApiService                 from "../../../service/ApiService";

const Exchange = () => {
  const wallet               = useSelector(state => state.user.wallet)
  const apiService           = new ApiService()
  const seigniorageService   = new SeigniorageService()
  const userService          = new UserService()
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService   = new StableTokenService()
  const [dataSourceHistory, setDataSourceHistory] = useState([])
  const [updateOrderStatus, setUpdateOrderStatus] = useState(0);

  useEffect(() => {
    apiService.loadTradeHistories(setDataSourceHistory)

    seigniorageService.loadOrders(true, false)
    seigniorageService.loadOrders(false, false)
    seigniorageService.loadOrdersRealTime(setDataSourceHistory)

    if (window.ethereum) {
      const loadData =  () => {
        userService.getBalance()
        volatileTokenService.loadMyVolatileTokenBalance()
        stableTokenService.loadMyStableTokenBalance()
      }
      setupWeb3(loadData)
    }
  }, [wallet])

  let volatileTokenBalance = useSelector(state => state.user.volatileTokenBalance)
  let stableTokenBalance   = useSelector(state => state.user.stableTokenBalance)
  let balance              = useSelector(state => state.user.balance)

  const sellVolatileToken = async (haveWei, wantWei) => {
    const have = BigInt(haveWei)
    const mnty = BigInt(volatileTokenBalance)

    let value = undefined
    console.log(have, mnty)
    if (have > mnty) {
      value = (have - mnty)
      if (value > BigInt(balance)) {
        throw "insufficient NTY"
      }
      value = value.toString()
    }

    await volatileTokenService.trade(haveWei, wantWei, value)
    if(updateOrderStatus === 0) setUpdateOrderStatus(1)
    else if(updateOrderStatus === 1) setUpdateOrderStatus(0)
  }

  const buyVolatileToken = async (haveAmount, wantAmount) => {
    if (BigInt(haveAmount) > BigInt(stableTokenBalance)) {
      throw "insufficient NEWSD"
    }
    await stableTokenService.trade(haveAmount, wantAmount)
    if(updateOrderStatus === 0) setUpdateOrderStatus(1)
    else if(updateOrderStatus === 1) setUpdateOrderStatus(0)
  }

  const cancelTrade = async (orderType, id) => {
    await seigniorageService.cancel(orderType, id)
    if(updateOrderStatus === 0) setUpdateOrderStatus(1)
    else if(updateOrderStatus === 1) setUpdateOrderStatus(0)
  }

  return (
    <BasePage>
      <input
        type="radio"
        name="chart-trade-tab"
        className="tab__btn-show--chart"
        id="open-chart-tab" defaultChecked/>
      <input
        type="radio"
        name="chart-trade-tab"
        className="tab__btn-show--trade"
        id="open-trade-tab"/>
      <Row className="tab">
        <Col span={12}>
          <label htmlFor="open-chart-tab" className="tab__btn-label--chart"><b>Chart</b></label>
        </Col>
        <Col span={12}>
          <label htmlFor="open-trade-tab" className="tab__btn-label--trade"><b>Trade</b></label>
        </Col>
      </Row>
      <Row>
        <Col
          lg={{span: 14, order: 0}}
          xs={24}>
            <Chart/>
        </Col>
        <Col 
          lg={{span: 14, order: 4}}
          xs={{span: 24, order: 4}}
          className="open-order">
          <OpenOrder updateOrderStatus={updateOrderStatus} cancelTrade={cancelTrade}/>
        </Col>
        <Col 
          lg={{span: 10, order: 1}}
          xs={{span: 12, order: 2}}
          className="order-book"
        >
          <OrderBook dataSourceHistory={dataSourceHistory} />
        </Col>
        <Col
          lg={{span: 10, order: 5}}
          xs={{span: 12, order: 1}}
          className="trade-box"
        >
          <BuySell sellVolatileToken={sellVolatileToken} buyVolatileToken={buyVolatileToken}/>
        </Col>
      </Row>
    </BasePage>
  )
}

export default Exchange;
