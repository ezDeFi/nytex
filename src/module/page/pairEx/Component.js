import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import Footer from '@/module/layout/Footer/Container' // eslint-disable-line
import Tx from 'ethereumjs-tx' // eslint-disable-line
import { Link } from 'react-router-dom' // eslint-disable-line
import web3 from 'web3'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { DECIMALS } from '@/constant'

import './style.scss'

import { Col, Row, Icon, Button, Breadcrumb, Table, Input, InputNumber } from 'antd' // eslint-disable-line

var BigNumber = require('big-number');

const weiToNUSD = (wei) => {
  return Number(wei / (10 ** (DECIMALS.nusd))).toFixed(4)
}

const weiToMNTY = (wei) => {
  return (Number(web3.utils.fromWei(wei.toString())) / 1000000).toFixed(4)
}

export default class extends LoggedInPage {
  state = {
    data: [],
    copied: false,
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
          <h3 className="text-center">User's Info</h3>
          <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{ 'textAlign': 'left' }}>

            <Row>
              <Col span={6}>
                Wallet:
              </Col>
              <Col span={6}>
                {this.props.wallet}
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                Balance:
              </Col>
              <Col span={6}>
                {weiToMNTY(this.props.balance)} MNTY
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                MNTY Tokens:
              </Col>
              <Col span={6}>
                {weiToMNTY(this.props.volatileTokenBalance)} MNTY
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                NUSD Tokens:
              </Col>
              <Col span={6}>
                {weiToNUSD(this.props.stableTokenBalance)} NUSD
              </Col>
            </Row>

            <Row>
              <Col span={2}>
                Amount
              </Col>
              <Col span={1}/>
              <Col span={8}>
                <InputNumber className="maxWidth"
                  defaultValue={0}
                  value={this.state.transferAmount}
                  onChange={this.transferAmountChange.bind(this)}
                />
              </Col>
              <Col span={1}/>
              <Col span={2}>
                to
              </Col>
              <Col span={1}/>
              <Col span={8}>
                <Input className="maxWidth"
                  defaultValue={0}
                  value={this.state.toWallet}
                  onChange={this.toWalletChange.bind(this)}
                />
              </Col>
              <Col span={1}/>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={0}/>
              <Col span={12}>
                <Button onClick={() => this.transferVolatileToken()} type="primary" className="btn-margin-top submit-button maxWidth">Transfer MNTY</Button>
              </Col>
              <Col span={0}/>
              <Col span={12}>
                <Button onClick={() => this.transferStableToken()} type="primary" className="btn-margin-top submit-button maxWidth">Transfer NUSD</Button>
              </Col>
              <Col span={0}/>
            </Row>

            <div className="ebp-header-divider dashboard-rate-margin">
            </div>

            <Row>
              <Col span={2}>
                Amount
              </Col>
              <Col span={1}/>
              <Col span={8}>
                <Input className="maxWidth"
                  defaultValue={0}
                  value={this.state.amount}
                  onChange={this.amountChange.bind(this)}
                />
              </Col>
              <Col span={1}/>
              <Col span={2}>
                Price
              </Col>
              <Col span={1}/>
              <Col span={8}>
                <Input className="maxWidth"
                  defaultValue={0}
                  value={this.state.price}
                  onChange={this.priceChange.bind(this)}
                />
              </Col>
              <Col span={1}/>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={0}/>
              <Col span={12}>
                <Button onClick={() => this.sellVolatileToken()} type="primary" className="btn-margin-top submit-button maxWidth">Sell MNTY</Button>
              </Col>
              <Col span={0}/>
              <Col span={12}>
                <Button onClick={() => this.buyVolatileToken()} type="primary" className="btn-margin-top submit-button maxWidth">Buy MNTY</Button>
              </Col>
              <Col span={0}/>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={2}>
                Id
              </Col>
              <Col span={1}/>
              <Col span={8}>
                <InputNumber className="maxWidth"
                  defaultValue={0}
                  value={this.state.id}
                  onChange={this.idChange.bind(this)}
                />
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={0}/>
              <Col span={12}>
                <Button onClick={() => this.remove(false)} type="primary" className="btn-margin-top submit-button maxWidth">Selling Order Remove</Button>
              </Col>
              <Col span={0}/>
              <Col span={12}>
                <Button onClick={() => this.remove(true)} type="primary" className="btn-margin-top submit-button maxWidth">Buying Order Remove</Button>
              </Col>
              <Col span={0}/>
            </Row>

            <div className="ebp-header-divider dashboard-rate-margin">
            </div>
            <Col className="text-center" span={24}>
              <h3 className="text-center">Orderbook</h3>
            </Col>
            <Col span={24}>
              {this.ordersRender(false)}
            </Col>
            <Col span={24}>
              {this.ordersRender(true)}
            </Col>

            <div className="ebp-header-divider dashboard-rate-margin">
            </div>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={24}>
                <Button onClick={() => this.props.reload()} type="primary" className="btn-margin-top submit-button maxWidth">Reload</Button>
              </Col>
            </Row>

            <div className="ebp-header-divider dashboard-rate-margin">
            </div>
          </div>
        </div>
      </div>
    )
  }

  ord_renderBreadcrumb () { // eslint-disable-line
    return (
      <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
        <Breadcrumb.Item><Link to="/seigniorage"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>seigniorage</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

remove(_orderType) {
  return this.props.remove(_orderType, this.state.id)
}

// async reload() {
//     this.setState({data: []})
//     await this.props.reload()
//     let falseLength = this.props.orders.false.length
//     let trueLength = this.props.orders.true.length
//     let l = falseLength > trueLength ? falseLength : trueLength
//     console.log('length = ', l)
//     let data = []
//     for (let i = 0; i < l; i++) {
//         let falseOrder = i< falseLength ? this.props.orders.false[i] : ''
//         let trueOrder = i < trueLength ? this.props.orders.true[i] : ''
//         data.push({
//             idWnty: falseOrder.id,
//             addressWnty: cutString(falseOrder.maker),
//             amountWnty: falseOrder.haveAmount,
//             priceWnty: falseOrder.haveAmount ? falseOrder.wantAmount / falseOrder.haveAmount : '',
//             idNusd: trueOrder.id,
//             addressNusd: cutString(trueOrder.maker),
//             amountNusd: trueOrder.wantAmount,
//             priceNusd: trueOrder.haveAmount ? trueOrder.haveAmount / trueOrder.wantAmount : ''
//         })
//     }
//     this.setState({data: data})
// }

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
                    title: 'id',
                    dataIndex: 'id',
                    key: 'id',
                    render: (text, record) => (
                        <span>
                            {record.id &&
                            <CopyToClipboard onCopy={this.onCopy} text={record.id}>
                                <button>Copy</button>
                            </CopyToClipboard>
                            }
                        </span>
                    )
                },
                {
                    title: 'address',
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
        <Table rowKey="id" dataSource={_orderType ? this.props.orders.true : this.props.orders.false} columns={columns} pagination={false} />
    </div>)
}

transferVolatileToken() {
    let zoom = 1e10
    let zoomExpo = 10
    let amount = BigNumber(Math.floor(this.state.transferAmount * zoom))
    amount = amount.multiply(BigNumber(10).power(DECIMALS.mnty - zoomExpo))
    this.props.transferVolatileToken(this.state.toWallet, amount)
}

transferStableToken() {
    let amount = BigNumber(Math.floor(this.state.transferAmount * zoom))
    amount = amount.multiply(BigNumber(10).power(DECIMALS.nusd - zoomExpo))
    this.props.transferStableToken(this.state.toWallet, amount)
}

sellVolatileToken() {
    let haveAmount = Number(this.state.amount)
    let price = Number(this.state.price)
    let wantAmount = haveAmount * price;
    console.log(wantAmount);
    haveAmount = BigNumber(Math.round(haveAmount * 10 ** 6)).multiply(BigNumber(10).pow(DECIMALS.mnty-6))
    wantAmount = BigNumber(Math.round(wantAmount * 10 ** 6)).multiply(BigNumber(10).pow(DECIMALS.nusd-6))
    console.log('*** have NTY: ', haveAmount.toString().slice(0, 3-DECIMALS.mnty))
    console.log('*** want USD: ', wantAmount.toString().slice(0, 3-DECIMALS.nusd))
    this.props.sellVolatileToken(haveAmount, wantAmount)
}

buyVolatileToken() {
    let wantAmount = Number(this.state.amount)
    let price = Number(this.state.price)
    let haveAmount = wantAmount * price
    haveAmount = BigNumber(Math.round(haveAmount * 10 ** 6)).multiply(BigNumber(10).pow(DECIMALS.nusd-6))
    wantAmount = BigNumber(Math.round(wantAmount * 10 ** 6)).multiply(BigNumber(10).pow(DECIMALS.mnty-6))
    console.log('*** have USD: ', haveAmount.toString().slice(0, 3-DECIMALS.nusd))
    console.log('*** want NTY: ', wantAmount.toString().slice(0, 3-DECIMALS.mnty))
    this.props.sellStableToken(haveAmount, wantAmount)
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
}
