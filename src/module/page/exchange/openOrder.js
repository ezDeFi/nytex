import React         from 'react';
import {Tabs, Table} from 'antd'
import BtnOval from '../../Component/ButtonOval'

const OpenOrder = () => {
  const {TabPane} = Tabs;

  const hideOtherPairs = <label className='hide-on-mobile'>
    <input type="checkbox"/>
    Hid Other Pairs
  </label>;


  const openOrderData = [
    {
      key   : 1,
      time  : '12:09 15:45:12',
      side  : 'buy',
      price: '110.00',
      amount: '1.00000',
      filled: '0.00%',
      Total: '110.00USDT',
      trigger: '-',
      action: 'cancel',
    },
    {
      key   : 2,
      time  : '12:09 15:45:12',
      side  : 'buy',
      price: '110.00',
      amount: '1.00000',
      filled: '0.00%',
      Total: '110.00USDT',
      trigger: '-',
      action: 'cancel',
    },
    {
      key   : 3,
      time  : '12:09 15:45:12',
      side  : 'buy',
      price: '110.00',
      amount: '1.00000',
      filled: '0.00%',
      Total: '110.00USDT',
      trigger: '-',
      action: 'cancel',
    },
    {
      key   : 4,
      time  : '12:09 15:45:12',
      side  : 'buy',
      price: '110.00',
      amount: '1.00000',
      filled: '0.00%',
      Total: '110.00USDT',
      trigger: '-',
      action: 'cancel',
    },
    {
      key   : 5,
      time  : '12:09 15:45:12',
      side  : 'buy',
      price: '110.00',
      amount: '1.00000',
      filled: '0.00%',
      Total: '110.00USDT',
      trigger: '-',
      action: 'cancel',
    },
  ]

  const openOrderColumns = [
    {
      title    : 'Time',
      dataIndex: 'time',
      key      : 'time',
    },
    {
      title    : 'Side',
      dataIndex: 'side',
      key      : 'side',
      render: text => <span style={{color: text === 'buy' ? '#00C28E' : '#FC4D5C'}}>{text}</span>
    },
    {
      title    : 'Price',
      dataIndex: 'price',
      key      : 'price',
    },
    {
      title    : 'Amount',
      dataIndex: 'amount',
      key      : 'amount',
    },
    {
      title    : 'Filled (%)',
      dataIndex: 'filled',
      key      : 'filled',
    },
    {
      title    : 'Total',
      dataIndex: 'total',
      key      : 'total',
    },
    {
      title    : 'Trigger Conditions',
      dataIndex: 'trigger',
      key      : 'Trigger'
    },
    {
      title    : 'Cancel All',
      dataIndex: 'action',
      key      : 'action',
    },
  ]

  const openOrder = (<Table dataSource={openOrderData} columns={openOrderColumns} pagination={false} />)
  const openHistory = (<Table dataSource={openOrderData} columns={openOrderColumns} pagination={false} />)
  const tradeHistory = (<Table dataSource={openOrderData} columns={openOrderColumns} pagination={false} />)

  const filterHistory = (
    <div className="open-order__search-box">
      <span><BtnOval className="btn-large btn-yellow">1 Day</BtnOval></span>
      <span><BtnOval className="btn-large">1 Week</BtnOval></span>
      <span><BtnOval className="btn-large">1 Month</BtnOval></span>
      <span><BtnOval className="btn-large">3 Month</BtnOval></span>
      <span>
        <label htmlFor="search-from" className="search-label">
          <span>From</span>
          <input type="text" id="search-from" className="search-input"/>
        </label>
      </span>
      <span>
        <label htmlFor="search-to" className="search-label">
          <span>To</span>
          <input type="text" id="search-to" className="search-input"/>
        </label>
      </span>
      <span><BtnOval className="btn-large btn-search">Search</BtnOval></span>
    </div>
  )

  return (
    <div className="open-order__content">
      <Tabs tabBarExtraContent={hideOtherPairs}>
        <TabPane tab="Open Orders" key="1">
          {filterHistory}
          {openOrder}
        </TabPane>
        <TabPane tab="Open History" key="2">
          {filterHistory}
          {openHistory}
        </TabPane>
        <TabPane tab="Trade History" key="3">
          {filterHistory}
          {tradeHistory}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default OpenOrder