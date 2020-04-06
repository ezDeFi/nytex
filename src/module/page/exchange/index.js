import React, {useEffect}         from 'react';
import {Row, Col, Table}          from 'antd'
import './style/index.scss'
import OrderBook                  from './orderBook'
import BuySell                    from './buySell'
import OpenOrder                  from './openOrder'
import BasePage                   from '../../page/StandardPage'
import SeigniorageService         from "../../../service/contracts/SeigniorageService";
import UserService                from "../../../service/UserService";
import VolatileTokenService       from "../../../service/contracts/VolatileTokenService";
import StableTokenService         from "../../../service/contracts/StableTokenService";
import {useSelector, useDispatch} from "react-redux";

const Exchange = () => {
  const seigniorageService   = new SeigniorageService()
  const userService          = new UserService()
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService   = new StableTokenService()

  useEffect(() => {
    seigniorageService.loadOrders(true, false)
    seigniorageService.loadOrders(false, false)
    seigniorageService.loadOrdersRealTime()
    // seigniorageService.loadOrders(false)
    userService.getBalance()
    volatileTokenService.loadMyVolatileTokenBalance()
    stableTokenService.loadMyStableTokenBalance()
  }, [])

  let volatileTokenBalance = useSelector(state => state.user.volatileTokenBalance)
  let stableTokenBalance   = useSelector(state => state.user.stableTokenBalance)
  let balance              = useSelector(state => state.user.balance)

  const sellVolatileToken = (haveWei, wantWei) => {
    const have = BigInt(haveWei)
    const mnty = BigInt(volatileTokenBalance)

    let value = undefined
    if (have > mnty) {
      value = (have - mnty)
      if (value > BigInt(balance)) {
        throw "insufficient NTY"
      }
      value = value.toString()
    }

    volatileTokenService.trade(haveWei, wantWei, value)
  }

  const buyVolatileToken = (haveAmount, wantAmount) => {
    if (BigInt(haveAmount) > BigInt(stableTokenBalance)) {
      throw "insufficient NEWSD"
    }
    return stableTokenService.trade(haveAmount, wantAmount)
  }

  const cancelTrade = (orderType, id) => {
    seigniorageService.cancel(orderType, id)
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
          xs={24}
          className="chart">
          <div className="chart__content">
            chart
          </div>
        </Col>
        <Col lg={{span: 14, order: 4}}
             xs={{span: 24, order: 4}}
             className="open-order">
          <OpenOrder cancelTrade={cancelTrade}/>
        </Col>
        <Col lg={{span: 10, order: 1}}
             xs={{span: 12, order: 2}}
             className="order-book"
        >
          <OrderBook/>
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
