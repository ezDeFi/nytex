import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import { thousands, weiToMNTY, weiToNUSD, mntyToWei, nusdToWei, mul } from '../../../util/help.js'
import { DECIMALS, CONTRACTS } from '@/constant'
import './style.scss'

import { Col, Row, Icon, Button, Breadcrumb, Table, Input, InputNumber } from 'antd' // eslint-disable-line
import { util } from 'node-forge'

var BigNumber = require('big-number');

export default class extends LoggedInPage {
  state = {
    data: [],
    copied: false,
    mnty: 0,
  }

  async componentDidMount() {
    // this.reload()
  }

  ord_renderContent () { // eslint-disable-line
    return (
      <div className="">
        <div className="ebp-header-divider">
        </div>

        <div className="ebp-page">
          <h3 className="text-center">Exchange</h3>
          <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{ 'textAlign': 'left' }}>

            <Row>
              <Col span={4}>
                Wallet:
              </Col>
              <Col span={6}>
                {this.props.wallet}
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={4}>
                NTY :
              </Col>

              <Col span={16}>
                {thousands(weiToMNTY(this.props.balance))} Million
              </Col>

              <Col span={4}>
                <Button
                  onClick={() => this.deposit()}
                  className="btn-margin-top submit-button maxWidth">
                    ⇓ MNTY
                </Button>
              </Col>
            </Row>

            <Row>
              <Col span={4}>
                MNTY :
              </Col>

              <Col span={10}>
                {thousands(weiToMNTY(this.props.volatileTokenBalance))}
              </Col>

              <Col span={6}>
                <Input className="maxWidth"
                  placeholder="0"
                  defaultValue={0}
                  value={this.state.mnty}
                  onChange={this.mntyChange.bind(this)}
                />
              </Col>
              <Col span={4}>
                <Button onClick={() => this.withdraw()}
                className="btn-margin-top submit-button maxWidth">
                  ⇑ NTY
              </Button>
              </Col>
            </Row>

            <Row>
              <Col span={4}>
                StableCoin:
              </Col>
              <Col span={18}>
                {thousands(weiToNUSD(this.props.stableTokenBalance))} NEWSD
              </Col>
            </Row>

            <div className="ebp-header-divider dashboard-rate-margin">
            </div>

            <Row>
              <Col span={4}>
                Inflated:
              </Col>
              <Col span={18}>
                {thousands(weiToMNTY(this.props.inflated))} MNTY
              </Col>
            </Row>

            <div className="ebp-header-divider dashboard-rate-margin">
            </div>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={24}>
                {this.ordersRender(false)}
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={6}>
                Exchange:
              </Col>
              <Col span={12}>
                {thousands(weiToMNTY(this.props.exVol))} MNTY + {thousands(weiToNUSD(this.props.exStb))} NewSD
              </Col>
              <Col span={6}>
                <Button onClick={() => this.sellVolatileToken()} className="btn-margin-top submit-button maxWidth">SELL</Button>
              </Col>
            </Row>

            <Row type="flex" align="middle" style={{ 'marginTop': '10px' }}>
              <Col span={2}>
                MNTY:
              </Col>
              <Col span={1}/>
              <Col span={5}>
                <Input className="maxWidth"
                  defaultValue={0}
                  value={this.state.amount}
                  onChange={this.amountChange.bind(this)}
                />
              </Col>
              <Col span={1}/>
              <Col span={2}>
                Price:
              </Col>
              <Col span={1}/>
              <Col span={5}>
                <Input className="maxWidth"
                  defaultValue={0}
                  value={this.state.price}
                  onChange={this.priceChange.bind(this)}
                />
              </Col>
              <Col span={6}>
                NEWSD/MNTY
              </Col>
            </Row>

            <Row style={{ 'marginTop': '10px' }}>
              <Col span={6}>
                <Button onClick={() => this.props.reload()} className="btn-margin-top submit-button maxWidth">Reload</Button>
              </Col>
              <Col span={12}/>
              <Col span={6}>
                <Button onClick={() => this.buyVolatileToken()} className="btn-margin-top submit-button maxWidth">BUY</Button>
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={24}>
                {this.ordersRender(true)}
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }

  ord_renderBreadcrumb () { // eslint-disable-line
    return (
      <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
        <Breadcrumb.Item><Link to="/exchange"><Icon type="home" /> Home</Link></Breadcrumb.Item>
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
    const haveAmount = this.state.amount
    const price = this.state.price
    const wantAmount = mul(haveAmount, price);
    const wantWei = nusdToWei(wantAmount);
    if (wantWei === '0') {
      console.error("Want amount too small");
      return;
    }
    const haveWei = mntyToWei(haveAmount);
    console.log('*** have NTY: ', thousands(haveWei))
    console.log('*** want USD: ', thousands(wantWei))
    this.props.sellVolatileToken(haveWei, wantWei)
}

buyVolatileToken() {
    const wantAmount = this.state.amount;
    const price = this.state.price;
    const haveAmount = mul(wantAmount, price);
    const haveWei = nusdToWei(haveAmount);
    if (haveWei === '0') {
      console.error("Have amount too small");
      return;
    }
    const wantWei = mntyToWei(wantAmount);
    console.log('*** have USD: ', thousands(haveWei))
    console.log('*** want NTY: ', thousands(wantWei))
    this.props.sellStableToken(haveWei, wantWei)
}

deposit() {
  let mnty = this.state.mnty;
  let wei = mntyToWei(mnty);
  this.props.deposit(wei)
}

withdraw() {
  let mnty = this.state.mnty;
  let wei = mntyToWei(mnty);
  this.props.withdraw(wei)
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
