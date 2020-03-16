import React from 'react';
import {Row, Col, Table} from 'antd'
import './style/index.scss'
import OrderBookBuySale from './orderBookBuySale'
import BuySale from './buySale'
import OpenOrder from './openOrder'
import BasePage from '../../page/StandardPage'


const Exchange = () => {
  const dataSource = [
    {
      key: 1,
      price: [0.17361, 'sale'],
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key: 2,
      price: [0.17361, 'buy'],
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key: 3,
      price: [0.17361, 'sale'],
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key: 4,
      price: [0.17361, 'sale'],
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key: 5,
      price: [0.17361, 'buy'],
      amount: 0.00025152,
      volume: 2.3764852,
    },
  ];

  const columns = [
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => {
        let text = price[0];
        let color = price[1] === 'buy' ? '#00C28E' : '#FC4D5C'
        return(<p style={{color: color, margin: 0}}>{text}</p>)
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
    },
  ];

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
          <label htmlFor="open-chart-tab" className="tab__btn-label--chart">Chart</label>
        </Col>
        <Col span={12}>
          <label htmlFor="open-trade-tab" className="tab__btn-label--trade">Trade</label>
        </Col>
      </Row>
      <Row>
        <Col
          lg={14}
          xs={24}
          className="tab__content--chart">
          <div className="chart">
            chart
          </div>
          <div className="user-order">
            <OpenOrder/>
          </div>
        </Col>
        <Col
          lg={{span:10}}
          xs={{span:24}}
          className="tab__content--trade">
          <Row>
            <Col lg={{span:12, order: 1}}
                 xs={{span:12, order: 2}}
              className="order-book__buy-and-sale-table"
            >
              <OrderBookBuySale/>
            </Col>
            <Col lg={{span:12, order: 2}}
                 xs={{span:24, order: 3}}
                 className="order-book__history-table"
            >
              <Table dataSource={dataSource} columns={columns} pagination={false} />;
            </Col>
            <Col
              lg={{span: 24, order: 3}}
              xs={{span: 12, order: 1}}
              className="trade-box"
            >
              <BuySale/>
            </Col>
          </Row>
        </Col>
      </Row>
    </BasePage>
  )
}

export default Exchange;
