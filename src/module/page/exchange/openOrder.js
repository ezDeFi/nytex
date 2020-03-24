import React                   from 'react';
import {Row, Col, Tabs, Table} from 'antd'
import BtnOval                 from '../../Component/ButtonOval'

const OpenOrder = () => {
  const {TabPane} = Tabs;

  const hideOtherPairs = <label className='hide-on-mobile'>
    <input type="checkbox"/>
    Hid Other Pairs
  </label>;


  const openOrderData = [
    {
      key    : 1,
      time   : '12:09 15:45:12',
      side   : 'buy',
      price  : '110.00',
      amount : '1.00000',
      filled : '0.00%',
      Total  : '110.00USDT',
      trigger: '-',
      action : 'cancel',
    },
    {
      key    : 2,
      time   : '12:09 15:45:12',
      side   : 'buy',
      price  : '110.00',
      amount : '1.00000',
      filled : '0.00%',
      Total  : '110.00USDT',
      trigger: '-',
      action : 'cancel',
    },
    {
      key    : 3,
      time   : '12:09 15:45:12',
      side   : 'buy',
      price  : '110.00',
      amount : '1.00000',
      filled : '0.00%',
      Total  : '110.00USDT',
      trigger: '-',
      action : 'cancel',
    },
    {
      key    : 4,
      time   : '12:09 15:45:12',
      side   : 'buy',
      price  : '110.00',
      amount : '1.00000',
      filled : '0.00%',
      Total  : '110.00USDT',
      trigger: '-',
      action : 'cancel',
    },
    {
      key    : 5,
      time   : '12:09 15:45:12',
      side   : 'buy',
      price  : '110.00',
      amount : '1.00000',
      filled : '0.00%',
      Total  : '110.00USDT',
      trigger: '-',
      action : 'cancel',
    },
  ]

  const openOrderColumns = [
    {
      title    : 'Time',
      dataIndex: 'time',
      key      : 'time',
      className: 'hide-on-mobile'
    },
    {
      title    : 'Side',
      dataIndex: 'side',
      key      : 'side',
      className: 'hide-on-mobile',
      render   : text => <span style={{color: text === 'buy' ? '#00C28E' : '#FC4D5C'}}>{text}</span>
    },
    {
      title    : 'Price',
      dataIndex: 'price',
      key      : 'price',
      className: 'hide-on-mobile'
    },
    {
      title    : 'Amount',
      dataIndex: 'amount',
      key      : 'amount',
      className: 'hide-on-mobile'
    },
    {
      title    : 'Filled (%)',
      dataIndex: 'filled',
      key      : 'filled',
      className: 'hide-on-mobile'
    },
    {
      title    : 'Total',
      dataIndex: 'total',
      key      : 'total',
      className: 'hide-on-mobile'
    },
    {
      title    : 'Trigger Conditions',
      dataIndex: 'trigger',
      key      : 'Trigger',
      className: 'hide-on-mobile'
    },
    {
      title    : 'Cancel All',
      dataIndex: 'action',
      key      : 'action',
      className: 'hide-on-mobile'
    },
    {
      dataIndex: 'amount_mobile',
      key      : 'amount_mobile',
      className: 'hide-on-desktop',
      render   : (value, object) => {
        return (<Row className="open-order__mobile-row">
          <Col xs={5} className="open-order__mobile-row--status">
            <p className="text-green">{object.side}</p>
            <p>{object.filled}</p>
          </Col>
          <Col xs={13}>
            <p className="open-order__mobile-row--currency">ETH/USDT</p>
            <Row>
              <Col xs={10} className="text-light-grey">Amount</Col>
              <Col xs={14}>
                <span>0.00000</span>/
                <span className="text-light-grey">{object.amount}</span>
              </Col>
            </Row>
            <Row>
              <Col xs={10} className="text-light-grey">Price</Col>
              <Col xs={14}>{object.price}</Col>
            </Row>
          </Col>
          <Col xs={6} className="open-order__mobile-row--action">
            <p>{object.time}</p>
            <div>
              <BtnOval className="btn-cancel">Cancel</BtnOval>
            </div>
          </Col>
        </Row>)
      }
    }
  ]

  const openOrder    = (<Table dataSource={openOrderData} columns={openOrderColumns} pagination={false}/>)
  const openHistory  = (<Table dataSource={openOrderData} columns={openOrderColumns} pagination={false}/>)
  const tradeHistory = (<Table dataSource={openOrderData} columns={openOrderColumns} pagination={false}/>)

  const filterHistory = (
    <div className="open-order__search-box">
      <span><BtnOval className="btn-large btn-yellow">1 Day</BtnOval></span>
      <span><BtnOval className="btn-large">1 Week</BtnOval></span>
      <span><BtnOval className="btn-large">1 Month</BtnOval></span>
      <span><BtnOval className="btn-large">3 Month</BtnOval></span>
      <span>
        <label htmlFor="search-from" className="search-label">
          <span className="hide-on-mobile">From</span>
          <input type="text" id="search-from" className="search-input"/>
        </label>
      </span>
      <span>
        <label htmlFor="search-to" className="search-label">
          <span className="hide-on-mobile">To</span>
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