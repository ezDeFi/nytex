import React, {useState, useEffect}               from 'react';
import {Row, Col, Tabs, Table, DatePicker, Modal} from 'antd'
import BtnOval                                    from '../../Component/ButtonOval'
import {useSelector}                              from "react-redux";
import ApiService                                 from "../../../service/ApiService";

const OpenOrder = (props) => {
  let address                   = useSelector(state => state.user.wallet)
  let web3                      = useSelector(state => state.user.web3)
  let [openOrder, setOpenOrder] = useState([]);

  let [startTimeFilter, setStartTimeFilter] = useState("");
  let [endTimeFilter, setEndTimeFilter]     = useState("");

  let [openHistory, setOpenHistory]   = useState([]);
  let [tradeHistory, setTradeHistory] = useState([]);
  const apiService                    = new ApiService()
  const {TabPane}                     = Tabs;
  const [filterFlag, setFilterFlag] = useState({
    openOrder   : 'day',
    openHistory : 'day',
    tradeHistory: 'day'
  });
  
  const hideOtherPairs = <label className='hide-on-mobile'>
    <input type="checkbox"/>
    Hide Other Pairs
  </label>;


  useEffect(() => {
    if (address) {
      let addressChecksum = web3.utils.toChecksumAddress(address)
      apiService.loadOpenOrder(setOpenOrder, addressChecksum)
      apiService.loadOpenHistory(setOpenHistory, addressChecksum)
      apiService.loadTradeHistory(setTradeHistory, addressChecksum)
    }
  }, [address])

  useEffect(() => {
    if(address) {
      filterOpenOrder('openOrder', filterFlag['openOrder'])
      filterOpenOrder('openHistory', filterFlag['openHistory'])
      filterOpenOrder('tradeHistory', filterFlag['tradeHistory'])
    }
  }, [props.updateOrderStatus])


  const cancelTrade = async (tradeRecode) => {
    await props.cancelTrade(tradeRecode.side.toLowerCase() === 'buy', tradeRecode.id)
  }

  const openOrderColumns = [
    {title: 'Time', dataIndex: 'time', key: 'time', className: 'hide-on-mobile'},
    {
      title    : 'Side',
      dataIndex: 'side',
      key      : 'side',
      className: 'hide-on-mobile',
      render   : text => <span style={{color: text.toLowerCase() === 'buy' ? '#00C28E' : '#FC4D5C'}}>{text}</span>
    },
    {title: 'Price', dataIndex: 'price', key: 'price', className: 'hide-on-mobile'},
    {title: 'Amount', dataIndex: 'amount', key: 'amount', className: 'hide-on-mobile'},
    {title: 'Filled (%)', dataIndex: 'filled', key: 'filled', className: 'hide-on-mobile'},
    {title: 'Total', dataIndex: 'total', key: 'total', className: 'hide-on-mobile'},
    {
      title    : 'Action',
      dataIndex: 'action',
      key      : 'action',
      className: 'hide-on-mobile right-align',
      render   : (value, object) => {
        return (<BtnOval className='btn-large' onClick={() => cancelTrade(object)}>Cancel</BtnOval>)
      }
    }
  ]

  const openOrderColumnsMobile = [
    {
      dataIndex: 'time', key: 'side', width: 70,
      render   : (value, object) => {
        return (<div>
          <p className="text-green">{object.side}</p>
          <p>{object.filled}</p>
        </div>)
      }
    },
    {
      dataIndex: 'time', key: 'time',
      render   : (value, object) => {
        return (<div>
          <p className="open-order__mobile-row--currency">MNTY/NUSD</p>
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
        </div>)
      }
    },
    {
      dataIndex: 'time', key: 'time', className: 'right-align', width: 100,
      render   : (value, object) => {
        return (<div>
          <p>{object.time}</p>
          <div>
            <BtnOval className="btn-cancel" onClick={() => cancelTrade(object)}>Cancel</BtnOval>
          </div>
        </div>)
      }
    }
  ]


  const openHistoryColumnsMobile = [
    {
      dataIndex: 'time', key: 'side', width: 70,
      render   : (value, object) => {
        return (<div>
          <p className="text-green text-size-md">{object.side}</p>
          <Row>
            <Col xs={12} className="text-light-grey">Price</Col>
            <Col xs={12}><span>{object.price}</span></Col>
          </Row>
        </div>)
      }
    },
    {
      dataIndex: 'time', key: 'time',
      render   : (value, object) => {
        return (<div>
          <p className="open-order__mobile-row--currency">MNTY/NUSD</p>
          <Row>
            <Col xs={8} className="text-light-grey">Amount</Col>
            <Col xs={14}>
              <span>{object.amount}</span>
            </Col>
          </Row>
        </div>)
      }
    },
    {
      dataIndex: 'time', key: 'time', className: 'right-align', width: 100,
      render   : (value, object) => {
        return (<div>
          <p className="text-light-grey">{object.time}</p>
          <p>{object.status}</p>
        </div>)
      }
    }
  ]

  const openHistoryColumns = [
    {title: 'Time', dataIndex: 'time', key: 'time', className: 'hide-on-mobile'},
    {
      title    : 'Side',
      dataIndex: 'side',
      key      : 'side',
      className: 'hide-on-mobile',
      render   : text => <span style={{color: text.toLowerCase() === 'buy' ? '#00C28E' : '#FC4D5C'}}>{text}</span>
    },
    {title: 'Average', dataIndex: 'average', key: 'average', className: 'hide-on-mobile'},
    {title: 'Price', dataIndex: 'price', key: 'price', className: 'hide-on-mobile'},
    {title: 'Filled (%)', dataIndex: 'filled', key: 'filled', className: 'hide-on-mobile'},
    {title: 'Amount', dataIndex: 'amount', key: 'amount', className: 'hide-on-mobile'},
    {title: 'Total', dataIndex: 'total', key: 'total', className: 'hide-on-mobile'},
    {title: 'Trigger Conditions', dataIndex: 'trigger', key: 'Trigger', className: 'hide-on-mobile'},
    {title: 'Status', dataIndex: 'status', key: 'status', className: 'hide-on-mobile  right-align'}
  ]

  const tradeHistoryColumns = [
    {title: 'Time', dataIndex: 'time', key: 'time', className: 'hide-on-mobile'},
    {title: 'Market', dataIndex: 'market', key: 'market', className: 'hide-on-mobile'},
    {
      title    : 'Type',
      dataIndex: 'side',
      key      : 'side',
      className: 'hide-on-mobile',
      render   : text => <span style={{color: text.toLowerCase() === 'buy' ? '#00C28E' : '#FC4D5C'}}>{text}</span>
    },
    {title: 'Price', dataIndex: 'price', key: 'price', className: 'hide-on-mobile'},
    {title: 'Filled (%)', dataIndex: 'filled', key: 'filled', className: 'hide-on-mobile'},
    {title: 'Total', dataIndex: 'total', key: 'total', className: 'hide-on-mobile right-align'},
  ]

  const tradeHistoryColumnsMobile = [
    {
      dataIndex: 'time', key: 'side', width: 70,
      render   : (value, object) => {
        return (<div>
          <p className="text-green text-size-md">{object.side}</p>
          <Row>
            <Col xs={12} className="text-light-grey">Price</Col>
            <Col xs={12}><span>{object.price}</span></Col>
          </Row>
        </div>)
      }
    },
    {
      dataIndex: 'time', key: 'time',
      render   : (value, object) => {
        return (<div>
          <p className="open-order__mobile-row--currency">MNTY/NUSD</p>
        </div>)
      }
    },
    {
      dataIndex: 'time', key: 'time', className: 'right-align', width: 150,
      render   : (value, object) => {
        return (<div>
          <p className="text-light-grey">{object.time}</p>
          <Row>
            <Col xs={12} className="text-light-grey">Total</Col>
            <Col xs={12}><span>{object.total} USDT</span></Col>
          </Row>
        </div>)
      }
    }
  ]

  const openOrderTable    = (
    <Row>
      <Col lg={24} xs={0}><Table scroll={{y: 250}} dataSource={openOrder} columns={openOrderColumns} pagination={false}/></Col>
      <Col lg={0} xs={24}><Table scroll={{y: 250}} dataSource={openOrder} columns={openOrderColumnsMobile} pagination={false}/></Col>
    </Row>
  )
  const openHistoryTable  = (
    <Row>
      <Col lg={24} xs={0}><Table scroll={{y: 250}} dataSource={openHistory} columns={openHistoryColumns} pagination={false}/></Col>
      <Col lg={0} xs={24}><Table scroll={{y: 250}} dataSource={openHistory} columns={openHistoryColumnsMobile} pagination={false}/></Col>
    </Row>
  )
  const tradeHistoryTable = (
    <Row>
      <Col lg={24} xs={0}><Table scroll={{y: 250}} dataSource={tradeHistory} columns={tradeHistoryColumns} pagination={false}/></Col>
      <Col lg={0} xs={24}><Table scroll={{y: 250}} dataSource={tradeHistory} columns={tradeHistoryColumnsMobile} pagination={false}/></Col>
    </Row>
  )

  const filterHistory = (type) => (
    <div className="open-order__search-box">
      <span>
        <BtnOval className={"btn-large " + (filterFlag[type] === 'day' && 'btn-yellow')}
                 onClick={() => filterOpenOrder(type, 'day')}
        >1 Day</BtnOval>
      </span>
      <span>
        <BtnOval className={"btn-large " + (filterFlag[type] === 'week' && 'btn-yellow')}
                 onClick={() => filterOpenOrder(type, 'week')}
        >1 Week</BtnOval>
      </span>
      <span>
        <BtnOval className={"btn-large " + (filterFlag[type] === 'month' && 'btn-yellow')}
                 onClick={() => filterOpenOrder(type, 'month')}
        >1 Month</BtnOval>
      </span>
      <span>
        <BtnOval className={"btn-large " + (filterFlag[type] === 'threeMonth' && 'btn-yellow')}
                 onClick={() => filterOpenOrder(type, 'threeMonth')}
        >3 Month</BtnOval>
      </span>
      <span>
        <label htmlFor="search-from" className="search-label">
          <span className="hide-on-mobile">From</span>
          <DatePicker className="search-input" suffixIcon="" placeholder="" onChange={(date, dateString) => setStartTimeFilter(dateString)}></DatePicker>
        </label>
      </span>
      <span>
        <label htmlFor="search-to" className="search-label">
          <span className="hide-on-mobile">To</span>
            <DatePicker className="search-input" suffixIcon="" placeholder="" onChange={(date, dateString) => setEndTimeFilter(dateString)}></DatePicker>
        </label>
      </span>
      <span>
        <BtnOval className="btn-large btn-search"
                 onClick={() => {
                   if (!startTimeFilter || !endTimeFilter) {
                     Modal.error({
                       title       : 'New Buy Order',
                       content     : "Time to filter is undefined",
                       maskClosable: true,
                     })
                   } else {
                     filterOpenOrder(type, 'search')
                   }
                 }}
        >Search</BtnOval>
      </span>
    </div>
  )

  const filterOpenOrder = (tableType, filterType) => {
    let from
    let to = new Date().getTime() / 1000
    setFilterFlag({...filterFlag, [tableType]: filterType})
    switch (filterType) {
      case 'search':
        from = new Date(startTimeFilter).getTime() / 1000
        to   = new Date(endTimeFilter).getTime() / 1000 + 86400
        break;
      case 'day':
        from = new Date().getTime() / 1000 - 86400
        break;
      case 'week':
        from = new Date().getTime() / 1000 - 7 *86400
        break;
      case 'month':
        from = new Date().getTime() / 1000 - 30 * 86400
        break;
      case 'threeMonth':
        from = new Date().getTime() / 1000 - 90 * 86400
        break;
      default:
        from = new Date().getTime() / 1000 - 86400
        break;
    }

    let addressChecksum = web3.utils.toChecksumAddress(address)
    if (tableType === 'openOrder') {
      apiService.loadOpenOrder(setOpenOrder, addressChecksum, parseInt(from), parseInt(to))
    } else if (tableType === 'openHistory') {
      apiService.loadOpenHistory(setOpenHistory, addressChecksum, parseInt(from), parseInt(to))
    } else if (tableType === 'tradeHistory') {
      apiService.loadTradeHistory(setTradeHistory, addressChecksum, parseInt(from), parseInt(to))
    }
  }

  return (
    <div className="open-order__content">
      <Tabs>
        <TabPane tab="Open Orders" key="1">
          {filterHistory('openOrder')}
          {openOrderTable}
        </TabPane>
        <TabPane tab="Open History" key="2">
          {filterHistory('openHistory')}
          {openHistoryTable}
        </TabPane>
        <TabPane tab="Trade History" key="3">
          {filterHistory('tradeHistory')}
          {tradeHistoryTable}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default OpenOrder