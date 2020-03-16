import React         from 'react';
import {Tabs, Table} from 'antd'

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

  return (
    <Tabs tabBarExtraContent={hideOtherPairs}>
      <TabPane tab="Open Orders" key="1">
        {openOrder}
      </TabPane>
      <TabPane tab="Open History" key="2">
        {openHistory}
      </TabPane>
      <TabPane tab="Trade History" key="3">
        {tradeHistory}
      </TabPane>
    </Tabs>
  )
}

export default OpenOrder