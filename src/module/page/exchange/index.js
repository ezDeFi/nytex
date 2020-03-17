import React from 'react';
import {Row, Col, Table} from 'antd'
import './style/index.scss'
import OrderBook from './orderBook'
import BuySale from './buySale'
import OpenOrder from './openOrder'
import BasePage from '../../page/StandardPage'


const Exchange = () => {
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
          <OpenOrder/>
        </Col>
        <Col lg={{span:10, order: 1}}
             xs={{span:12, order: 2}}
             className="order-book"
        >
          <OrderBook/>
        </Col>
        <Col
          lg={{span: 10, order: 5}}
          xs={{span: 12, order: 1}}
          className="trade-box"
        >
          <BuySale/>
        </Col>
      </Row>
    </BasePage>
  )
}

export default Exchange;
