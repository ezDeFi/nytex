import React, {useState, useEffect}         from 'react';
import {Table, Row, Col}                    from 'antd'
import {useSelector, useDispatch, useStore} from "react-redux";
import SeigniorageService                   from "../../../service/contracts/SeigniorageService";
import store                                from "../../../store";

const OrderBook = () => {
  let listBuys         = useSelector(state => state.seigniorage.bids);
  let listSell         = useSelector(state => state.seigniorage.asks);
  let listBuySource    = []
  let listSellSource   = []
  const exchangeAction = store.getRedux('exchange').actions;
  const dispatch       = useDispatch()

  for (let i in listBuys) {
    // let index = listBuySource.findIndex((e) => {
    //   return e.price === listBuys[i].price
    // })
    // if(index >= 0) {
    //   listBuySource[index].amount += parseFloat(listBuys[i].amount)
    //   listBuySource[index].volume += parseFloat(listBuys[i].volume)
    //   continue;
    // } else {
      listBuySource.push({
        key        : i,
        price      : listBuys[i].price,
        amount     : parseFloat(listBuys[i].amount),
        volume     : parseFloat(listBuys[i].volume),
        priceToSort: listBuys[i].priceToSort
      })
    // }
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
        amount     : parseFloat(listSell[i].amount),
        volume     : parseFloat(listSell[i].volume),
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
      className: 'left-align',
      render   : text => (<p style={{color: 'red', margin: 0}}>{text}</p>)
    },
    {
      title    : 'Amount',
      dataIndex: 'amount',
      key      : 'amount',
      className: 'right',
    },
    {
      title    : 'Volume',
      dataIndex: 'volume',
      key      : 'volume',
      className: 'right-align'
    },
  ];

  const buyColumns = [
    {
      dataIndex: 'price',
      key      : 'price',
      className: 'left-align',
      render   : text => (<p style={{color: '#00C28E', margin: 0}}>{text}</p>)
    },
    {
      dataIndex: 'amount',
      key      : 'amount',
      className: 'right',
    },
    {
      dataIndex: 'volume',
      key      : 'volume',
      className: 'right-align'
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
          <Col span={6} className="left-align">0.02342</Col>
          <Col span={8} className="right-align">$1775.600602</Col>
          <Col span={10} className="right-align">-1.69%</Col>
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