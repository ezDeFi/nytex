import React, {useState, useEffect}         from 'react';
import {Table, Row, Col}                    from 'antd'
import {useSelector, useDispatch, useStore} from "react-redux";
import store                                from "../../../store";
import {cutFloat}                           from '@/util/help.js'

const OrderBook = () => {
  let ntyQuote         = useSelector(state => state.common.ntyQuote);
  let listBuys         = useSelector(state => state.seigniorage.bids);
  let listSell         = useSelector(state => state.seigniorage.asks);
  let listBuySource    = []
  let listSellSource   = []
  const exchangeAction = store.getRedux('exchange').actions;
  const dispatch       = useDispatch()

  for (let i in listBuys) {
    listBuySource.push({
      key        : i,
      price      : listBuys[i].price,
      amount     : cutFloat(listBuys[i].amount, 6),
      volume     : cutFloat(listBuys[i].volume, 6),
      priceToSort: listBuys[i].priceToSort
    })
  }
  listBuySource.sort(function (a, b) {
    return b.priceToSort - a.priceToSort;
  });

  for (let i in listSell) {
    // let index = listSellSource.findIndex((e) => {
    //   return e.price === listSell[i].price
    // })
    // if(index >= 0) {
    //   listSellSource[index].amount += parseFloat(listSell[i].amount)
    //   listSellSource[index].volume += parseFloat(listSell[i].volume)
    //   continue;
    // } else {
    listSellSource.push({
      key        : i,
      price      : listSell[i].price,
      amount     : cutFloat(listSell[i].amount, 6),
      volume     : cutFloat(listSell[i].volume, 6),
      priceToSort: listSell[i].priceToSort
    })
    // }
  }
  listSellSource.sort(function (a, b) {
    return parseFloat(b.priceToSort) - parseFloat(a.priceToSort);
  });

  const sellcolumns = [
    {
      title    : 'Price',
      dataIndex: 'price',
      key      : 'price',
      className: 'left-align order-book__column--price',
      render   : text => (<p style={{color: 'red', margin: 0}}>{text}</p>)
    },
    {
      title    : 'Amount',
      dataIndex: 'amount',
      key      : 'amount',
      className: 'right-align order-book__column--amount',
    },
    {
      title    : 'Volume',
      dataIndex: 'volume',
      key      : 'volume',
      className: 'right-align order-book__column--volume',
      render: (value, object) => {
        const maxVolume = 1;
        const widthPercent = 250 * parseFloat(value)/maxVolume > maxVolume ?  250: 250 * parseFloat(value)/maxVolume
        return (<div>
          <p className="order-book__volume-mask order-book__volume-mask-sell" style={{width: widthPercent + '%'}}></p>
          <p className="order-book__volume-value">{value}</p>
        </div>)
      }
    },
  ];

  const buyColumns = [
    {
      dataIndex: 'price',
      key      : 'price',
      className: 'left-align order-book__column--price',
      render   : text => (<p style={{color: '#00C28E', margin: 0}}>{text}</p>)
    },
    {
      dataIndex: 'amount',
      key      : 'amount',
      className: 'right-align order-book__column--amount',
    },
    {
      dataIndex: 'volume',
      key      : 'volume',
      className: 'right-align order-book__column--volume',
      render: (value) => {
        const maxVolume = 1;
        const widthPercent = 250 * parseFloat(value)/maxVolume > maxVolume ?  250: 250 * parseFloat(value)/maxVolume
        return (<div>
          <p className="order-book__volume-mask order-book__volume-mask-buy" style={{width: widthPercent + '%'}}></p>
          <p className="order-book__volume-value">{value}</p>
        </div>)
      }
    },
  ];

  //--
  const dataSourceHistory = [
    {
      key   : 1,
      price : [0.17361, 'sell'],
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key   : 2,
      price : [0.17361, 'buy'],
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key   : 3,
      price : [0.17361, 'sell'],
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key   : 4,
      price : [0.17361, 'sell'],
      amount: 0.00025152,
      volume: 2.3764852,
    },
    {
      key   : 5,
      price : [0.17361, 'buy'],
      amount: 0.00025152,
      volume: 2.3764852,
    },
  ];

  const columnsHistory = [
    {
      title    : 'Price',
      dataIndex: 'price',
      key      : 'price',
      render   : (price) => {
        let text  = price[0];
        let color = price[1] === 'buy' ? '#00C28E' : '#FC4D5C'
        return (<p style={{color: color, margin: 0}}>{text}</p>)
      }
    },
    {
      title    : 'Amount',
      dataIndex: 'amount',
      key      : 'amount',
      className: 'center'
    },
    {
      title    : 'Volume',
      dataIndex: 'volume',
      key      : 'volume',
      className: 'right-align'
    },
  ];

  const onRowTable = (record) => {
    return {
      onClick: () => {
        dispatch(exchangeAction.priceToBuy_update(parseFloat(record.price)))
        dispatch(exchangeAction.priceToSell_update(parseFloat(record.price)))
      }
    }
  }

  return (
    <Row className="order-book__content">
      <Col lg={12} xs={24} className="order-book__buy-and-sell">
        <p className="order-book__title hide-on-mobile">Orderbook</p>
        <div className="order-book__sell">
          <Table dataSource={listSellSource} columns={sellcolumns} pagination={false} onRow={onRowTable}
          />
        </div>
        <Row className="order-book__current-price">
          <Col span={6} className="left-align">${cutFloat(ntyQuote.price * Math.pow(10, 6), 2)}</Col>
          <Col span={8} className="right-align">${cutFloat(ntyQuote.volume_24h, 2)}</Col>
          <Col span={10} className="right-align">{cutFloat(ntyQuote.percent_change_24h, 2)}%</Col>
        </Row>
        <div className="order-book__buy-table">
          <Table dataSource={listBuySource} columns={buyColumns} pagination={false} onRow={onRowTable}/>
        </div>
      </Col>
      <Col lg={12} xs={0} className="order-book__history-table">
        <Table dataSource={dataSourceHistory} columns={columnsHistory} pagination={false} onRow={onRowTable}/>
      </Col>
    </Row>
  )
}

export default OrderBook