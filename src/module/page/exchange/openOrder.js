import React                                from 'react';
import {Row, Col, Tabs, Table}              from 'antd'
import BtnOval                              from '../../Component/ButtonOval'
import {useSelector, useDispatch, useStore} from "react-redux";
import store                                from "../../../store";

const OpenOrder = (props) => {
  let store               = useStore()
  let listBuys            = useSelector(state => state.seigniorage.bids);
  let listSell            = useSelector(state => state.seigniorage.asks);
  const dispatch          = useDispatch()
  const seigniorageAction = store.getRedux('seigniorage').actions;

  let walletAddress = store.getState().user.wallet

  let openOrderData = [];

  const {TabPane} = Tabs;

  const hideOtherPairs = <label className='hide-on-mobile'>
    <input type="checkbox"/>
    Hide Other Pairs
  </label>;

  for (let i in listBuys) {
    if (listBuys[i].maker.toLocaleLowerCase() === walletAddress.toLocaleLowerCase())
      openOrderData.push({
        key        : 'buy-' + i,
        id         : listBuys[i].id,
        time       : '12:09 15:45:12',
        side       : 'buy',
        price      : listBuys[i].price,
        amount     : parseFloat(listBuys[i].amount),
        Total      : parseFloat(listBuys[i].volume),
        priceToSort: listBuys[i].priceToSort,
        trigger    : '-',
        action     : 'cancel',
      })
  }

  for (let i in listSell) {
    // if(listSell[i].maker === userWallet)
    if (listSell[i].maker.toLocaleLowerCase() === walletAddress.toLocaleLowerCase())
      openOrderData.push({
        key        : 'sell-' + i,
        id         : listSell[i].id,
        time       : '12:09 15:45:12',
        side       : 'sell',
        price      : listSell[i].price,
        amount     : parseFloat(listSell[i].amount),
        Total      : parseFloat(listSell[i].volume),
        priceToSort: listSell[i].priceToSort,
        trigger    : '-',
        action     : 'cancel',
      })
  }

  const cancelTrade = async (tradeRecode) => {
    let type = tradeRecode.key.split('-')[0]
    await props.cancelTrade(type === 'buy', tradeRecode.id)
  }

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
      className: 'hide-on-mobile',
      render   : (value, object) => {
        return (<BtnOval className='btn-large' onClick={() => cancelTrade(object)}>Cancel</BtnOval>)
      }
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