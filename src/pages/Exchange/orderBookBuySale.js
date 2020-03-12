import React  from 'react';
import {Table} from 'antd'
// import Table  from '../../components/ExchangeTable'


const OrderBookBuySale = () => {

  const dataSource = [
    {
      key: 1,
      price: 0.17361,
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key: 2,
      price: 0.17361,
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key: 3,
      price: 0.17361,
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key: 4,
      price: 0.17361,
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key: 5,
      price: 0.17361,
      amount: 0.00025152,
      volume: 2.3764852,
    },
  ];

  const salecolumns = [
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: text => (<p style={{color: 'red', margin: 0}}>{text}</p>)
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
      className: 'hide-on-mobile'
    },
  ];

  const buyColumns = [
    {
      dataIndex: 'price',
      key: 'price',
      render: text => (<p style={{color: '#00C28E', margin: 0}}>{text}</p>)
    },
    {
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      dataIndex: 'volume',
      key: 'volume',
      className: 'hide-on-mobile'
    },
  ];


  return (
    <>
      <p className="order-book__title">Orderbook</p>
      <div className="order-book__sale-table">
        <Table dataSource={dataSource} columns={salecolumns} pagination={false} />;
      </div>
      <div className="order-book__buy-table">
        <Table dataSource={dataSource} columns={buyColumns} pagination={false} />;
      </div>
    </>
  )
}

export default OrderBookBuySale