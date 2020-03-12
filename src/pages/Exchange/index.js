import React from 'react';
import userService       from "../../service/UserService"
import {Row, Col, Table} from 'antd'
import styles from './exchange.module.scss'
import OrderBookBuySale from './orderBookBuySale'
import BuySale from './buySale'
import OpenOrder from './openOrder'
import './customAnt.scss'


userService.fetchData()

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
    <div>
      <Row className={styles.chartTradeTab}>
        <Col span={12}>
          <label htmlFor="open-chart-tab">Chart</label>
        </Col>
        <Col span={12}>
          <label htmlFor="open-trade-tab">Trade</label>
        </Col>
      </Row>
      <input
        type="radio"
        name="chart-trade-tab"
        className={styles.showChartRadio}
        id="open-chart-tab" defaultChecked/>
      <input
        type="radio"
        name="chart-trade-tab"
        className={styles.showTradeRadio }
        id="open-trade-tab"/>
      <Row>
        <Col
          lg={15}
          xs={24}
          className={styles.chartHistoryBox}>
          <div>
            chart
          </div>
          <div className={styles.orderHistoryBox}>
            <OpenOrder/>
          </div>
        </Col>
        <Col
          lg={{span:9}}
          xs={{span:24}}
          className={styles.tradeBox}>
          <Row className={styles.tradeContent}>
            <Col lg={{span:12, order: 1}}
                 xs={{span:12, order: 2}}
              className={styles.listBuySaleBox}
            >
              <OrderBookBuySale/>
            </Col>
            <Col lg={{span:12, order: 2}}
                 xs={{span:24, order: 3}}
                 className={styles.historyList}
            >
              <Table dataSource={dataSource} columns={columns} pagination={false} />;
            </Col>
            <Col
              lg={{span: 24, order: 3}}
              xs={{span: 12, order: 1}}
              className={styles.buySaleBox}
            >
              <BuySale/>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Exchange;
