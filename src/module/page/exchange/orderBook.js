import React             from 'react';
import {Table, Row, Col} from 'antd'

const OrderBook = () => {

  const dataSource = [
    {
      key   : 1,
      price : 0.17361,
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key   : 2,
      price : 0.17361,
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key   : 3,
      price : 0.17361,
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key   : 4,
      price : 0.17361,
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key   : 5,
      price : 0.17361,
      amount: 0.00025152,
      volume: 2.3764852,
    },
  ];

  const salecolumns = [
    {
      title    : 'Price',
      dataIndex: 'price',
      key      : 'price',
      render   : text => (<p style={{color: 'red', margin: 0}}>{text}</p>)
    },
    {
      title    : 'Amount',
      dataIndex: 'amount',
      key      : 'amount',
    },
    {
      title    : 'Volume',
      dataIndex: 'volume',
      key      : 'volume',
      className: 'hide-on-mobile'
    },
  ];

  const buyColumns = [
    {
      dataIndex: 'price',
      key      : 'price',
      render   : text => (<p style={{color: '#00C28E', margin: 0}}>{text}</p>)
    },
    {
      dataIndex: 'amount',
      key      : 'amount',
    },
    {
      dataIndex: 'volume',
      key      : 'volume',
      className: 'hide-on-mobile'
    },
  ];


  //--
  const dataSourceHistory = [
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

  const columnsHistory = [
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
    <Row className="order-book__content">
      <Col lg={12} xs={24}>
        <p className="order-book__title">Orderbook</p>
        <div className="order-book__sale">
          <Table dataSource={dataSource} columns={salecolumns} pagination={false}/>
        </div>
        <Row className="order-book__current-price">
          <Col span={6}>0.02342</Col>
          <Col span={8}>$1775.600602</Col>
          <Col span={8}>-1.69%</Col>
        </Row>
        <div className="order-book__buy-table">
          <Table dataSource={dataSource} columns={buyColumns} pagination={false}/>
        </div>
      </Col>
      <Col lg={12} xs={0}>
        <Table dataSource={dataSourceHistory} columns={columnsHistory} pagination={false} />
      </Col>
    </Row>
  )
}

export default OrderBook