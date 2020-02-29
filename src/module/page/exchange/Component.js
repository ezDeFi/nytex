import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import { thousands, weiToNTY, weiToMNTY, weiToNUSD, mntyToWei, nusdToWei, mul } from '@/util/help.js'
import { CONTRACTS } from '@/constant'
import './style.scss'

import { Col, Row, Icon, Button, Breadcrumb, Table, Input, Modal } from 'antd' // eslint-disable-line

export default class extends LoggedInPage {
  state = {
    amount: '',
    price: '',
    data: [],
  }

  async componentDidMount() {
    // this.reload()
  }

  ord_renderContent () { // eslint-disable-line
    const mnty = BigInt(this.props.volatileTokenBalance)
    const nty = BigInt(this.props.balance)
    const total = (mnty + nty) / BigInt(1000000)
    const totalString = weiToNTY(total.toString())
    return (
      <div>
        <div className="trading_Orderbook">
          <div className="trading_View">
             
          </div>
          <div className="order_Book">

          </div>
        </div>
 
        <div className="open_Interface">
          <div className="open_Order">

          </div>
          <div className="order_Interface">

          </div>
        </div>
      </div>
    )
  }

  ord_renderBreadcrumb () { // eslint-disable-line
    return (
      <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
        <Breadcrumb.Item><Link to="/home"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>exchange</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

onCopy = () => {
  this.setState({copied: true});
};

ordersRender(_orderType) {
  //const data = [{'fromAmountWnty' : 0, 'toAmountWnty' : 1, 'fromAmountNusd' : 2, 'toAmountNusd' : 3}];
  const columns = [
    {
      title: _orderType ? 'Buy' : 'Sell',
      children: [
        {
          title: 'action',
          dataIndex: 'action',
          key: 'action',
          render: (text, record) => (
            <span>
              {record.maker.substring(0, 5) === this.props.wallet.substring(0, 5) &&
                <Button
                  onClick={() => this.props.cancel(_orderType, record.id)}
                  className="btn-margin-top submit-button maxWidth">
                    Cancel
                </Button>
              }
            </span>
          )
        },
        {
          title: 'maker',
          dataIndex: 'maker',
          key: 'maker'
        },
        {
          title: 'amount',
          dataIndex: 'amount',
          key: 'amount'
        },
        {
          title: 'price',
          dataIndex: 'price',
          key: 'price'
        },
      ]
    },
  ]
  return (<div>
    <Table rowKey="seq"
      dataSource={_orderType ? Object.values(this.props.bids) : Object.values(this.props.asks)}
      columns={columns} pagination={false} />
  </div>)
}

sellVolatileToken() {
  try {
    let haveAmount, haveWei, wantWei
    try {
      haveAmount = this.state.amount.trim()
      haveWei = mntyToWei(haveAmount);
      BigInt(haveWei)
    } catch (e) {
      console.error(e)
      throw 'invalid amount'
    }
    try {
      const price = this.state.price.trim()
      const wantAmount = mul(haveAmount, price);
      wantWei = nusdToWei(wantAmount);
    } catch(e) {
      console.error(e)
      throw 'invalid price'
    }
    if (wantWei === '0') {
      throw "amount or price too small"
    }
    console.log('*** have NTY: ', thousands(haveWei))
    console.log('*** want USD: ', thousands(wantWei))
    this.props.sellVolatileToken(haveWei, wantWei)
  } catch(e) {
    if (typeof e === 'string') {
      Modal.error({
        title: 'New Sell Order',
        content: e,
        maskClosable: true,
      })
    } else {
      console.error(e)
      Modal.error({
        title: 'New Sell Order',
        content: 'unable to create sell order',
        maskClosable: true,
      })
    }
  }
}

buyVolatileToken() {
  try {
    let wantAmount, wantWei, haveWei
    try {
      wantAmount = this.state.amount.trim();
      wantWei = mntyToWei(wantAmount);
      BigInt(wantWei)
    } catch(e) {
      console.error(e)
      throw 'invalid amount'
    }
    try {
      const price = this.state.price;
      const haveAmount = mul(wantAmount, price);
      haveWei = nusdToWei(haveAmount);
    } catch(e) {
      console.error(e)
      throw 'invalid price'
    }
    if (haveWei === '0') {
      throw "amount or price too small"
    }
    console.log('*** have USD: ', thousands(haveWei))
    console.log('*** want NTY: ', thousands(wantWei))
    this.props.sellStableToken(haveWei, wantWei)
  } catch(e) {
    if (typeof e === 'string') {
      Modal.error({
        title: 'New Buy Order',
        content: e,
        maskClosable: true,
      })
    } else {
      console.error(e)
      Modal.error({
        title: 'New Buy Order',
        content: 'unable to create buy order',
        maskClosable: true,
      })
    }
  }
}

deposit() {
  try {
    const mnty = this.state.mnty
    const wei = BigInt(mntyToWei(mnty))
    if (wei <= 0) {
      throw 'amount must be positive'
    }
    this.props.deposit(wei.toString())
      .catch(e => {
        if (typeof e === 'string') {
          Modal.error({
            title: 'Deposit NTY',
            content: e,
            maskClosable: true,
          })
        } else {
          console.error(e)
          Modal.error({
            title: 'Deposit NTY',
            content: 'unable to deposit NTY',
            maskClosable: true,
          })
        }
      })
  } catch(e) {
    if (typeof e === 'string') {
      Modal.error({
        title: 'Deposit NTY',
        content: e,
        maskClosable: true,
      })
    } else {
      console.error(e)
      Modal.error({
        title: 'Deposit NTY',
        content: 'invalid amount',
        maskClosable: true,
      })
    }
  }
}

withdraw() {
  try {
    const mnty = this.state.mnty
    const wei = BigInt(mntyToWei(mnty))
    if (wei <= 0) {
      throw 'amount must be positive'
    }
    this.props.withdraw(wei.toString())
      .catch(e => {
        if (typeof e === 'string') {
          Modal.error({
            title: 'Withdraw NTY',
            content: e,
            maskClosable: true,
          })
        } else {
          console.error(e)
          Modal.error({
            title: 'Withdraw NTY',
            content: 'unable to withdraw NTY',
            maskClosable: true,
          })
        }
      })
  } catch(e) {
    if (typeof e === 'string') {
      Modal.error({
        title: 'Withdraw NTY',
        content: e,
        maskClosable: true,
      })
    } else {
      console.error(e)
      Modal.error({
        title: 'Withdraw NTY',
        content: 'invaild amount',
        maskClosable: true,
      })
    }
  }
}

idChange(e) {
    this.setState({
        id: e.target.value
    })
}

toWalletChange(e) {
  this.setState({
    toWallet: e.target.value
  })
}

transferAmountChange(amount) {
  this.setState({
    transferAmount: amount
  })
}

amountChange(e) {
  this.setState({
    amount: e.target.value
  })
}

priceChange(e) {
  this.setState({
    price: e.target.value
  })
}

mntyChange(e) {
  this.setState({
    mnty: e.target.value
  })
}

}
