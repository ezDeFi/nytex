import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import { thousands, weiToNTY, weiToMNTY, weiToNUSD, mntyToWei, nusdToWei, mul } from '@/util/help.js'
import { CONTRACTS } from '@/constant'
import './style.scss'
import BigInt from 'big-integer';
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

  ord_renderContent() { // eslint-disable-line
    const mnty = BigInt(this.props.volatileTokenBalance)
    const nty = BigInt(this.props.balance)
    const total = (mnty + nty) / BigInt(1000000)
    const totalString = weiToNTY(total.toString())
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
                Native:
              </Col>

              <Col span={16}>
                {thousands(weiToMNTY(this.props.balance))} Million NTY
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
                Total:
              </Col>

              <Col span={8}>
                {thousands(totalString)} Million NTY
              </Col>

              <Col span={8}>
                <Input className="maxWidth"
                  placeholder="MNTY to convert"
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
              <Col span={6}>
                <Input className="maxWidth"
                  placeholder="NEWSD"
                  defaultValue={0}
                  value={this.state.newsdToTransfer}
                  onChange={this.newsdToTransferChange.bind(this)}
                />
              </Col>
              <Col span={14}>
                <Input className="maxWidth"
                  placeholder="To Address"
                  defaultValue={0x0}
                  value={this.state.addressToTransfer}
                  onChange={this.addressToTransferChange.bind(this)}
               />
              </Col>
              <Col span={4}>
                <Button onClick={() => this.newsdTransfer()}
                  className="btn-margin-top submit-button maxWidth">
                    Transfer
                </Button>
              </Col>
            </Row>

            <Row>
              <Col span={18}>
                <Input className="maxWidth"
                  placeholder="From Address"
                  defaultValue={0x0}
                  value={this.state.addressToTransferFrom}
                  onChange={this.addressToTransferFromChange.bind(this)}
               />
              </Col>
              <Col span={6}>
                <Button onClick={() => this.newsdTransferFrom()}
                  className="btn-margin-top submit-button maxWidth">
                    Transfer From
                </Button>
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
              <Col span={14}>
                {thousands(weiToMNTY(this.props.exVol))} MNTY + {thousands(weiToNUSD(this.props.exStb))} NewSD
              </Col>
              <Col span={4}>
                <Button type='primary' onClick={() => this.sellVolatileToken()} className="btn-margin-top submit-button maxWidth">SELL</Button>
              </Col>
            </Row>

            <Row type="flex" align="middle" style={{ 'marginTop': '5px' }}>
              <Col span={2}>
                Amount:
              </Col>
              <Col span={1} />
              <Col span={8}>
                <Input className="maxWidth"
                  placeholder="MNTY"
                  defaultValue={0}
                  value={this.state.amount}
                  onChange={this.amountChange.bind(this)}
                />
              </Col>
              <Col span={2} />
              <Col span={2}>
                Price:
              </Col>
              <Col span={1} />
              <Col span={8}>
                <Input className="maxWidth"
                  placeholder="MNTY/NEWSD"
                  defaultValue={0}
                  value={this.state.price}
                  onChange={this.priceChange.bind(this)}
                />
              </Col>
            </Row>

            <Row style={{ 'marginTop': '5px' }}>
              <Col span={5}>
                <Button onClick={() => this.props.reload()} className="btn-margin-top submit-button maxWidth">RELOAD</Button>
              </Col>
              <Col span={4} />
              <Col span={7}>
                <Button onClick={() => this.toggleDebug()} className="btn-margin-top submit-button maxWidth">
                  DEBUG
                </Button>
              </Col>
              <Col span={4} />
              <Col span={4}>
                <Button type='primary' onClick={() => this.buyVolatileToken()} className="btn-margin-top submit-button maxWidth">BUY</Button>
              </Col>
            </Row>

            {this.state.debug &&
            <Row style={{ 'marginTop': '15px' }}>
              <Col span={7}/>
              <Col span={10}>
                <Input className="maxWidth"
                  placeholder="NewSD to absorb"
                  defaultValue={0}
                  value={this.state.absorption}
                  onChange={this.absorptionChange.bind(this)}
                />
              </Col>
              <Col span={4}>
                <Button onClick={() => this.absorb()}
                  className="btn-margin-top submit-button maxWidth">
                    ABSORB
                </Button>
              </Col>
              <Col span={3}>
                <Button onClick={() => this.absorbPeA()}
                  className="btn-margin-top submit-button maxWidth">
                    PeA
                </Button>
              </Col>
            </Row>
            }

            {this.state.debug &&
            <Row type="flex" align="middle" style={{ 'marginTop': '5px' }}>
              <Col span={7}>
                {this.tokenToApprove()} Allowance:
              </Col>
              <Col span={7}>
                {this.allowanceRender()}
              </Col>
              <Col span={6}>
                <Input className="maxWidth"
                  placeholder={this.tokenToApprove()}
                  defaultValue={0}
                  value={this.state.amountToApprove}
                  onChange={this.amountToApproveChange.bind(this)}
                />
              </Col>
              <Col span={4}>
                <Button onClick={() => this.approve()}
                  className="btn-margin-top submit-button maxWidth">Approve</Button>
              </Col>
            </Row>
            }

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

  ord_renderBreadcrumb() { // eslint-disable-line
    return (
      <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
        <Breadcrumb.Item><Link to="/home"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>exchange</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

  onCopy = () => {
    this.setState({ copied: true });
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
      } catch (e) {
        console.error(e)
        throw 'invalid price'
      }
      if (wantWei === '0') {
        throw "amount or price too small"
      }
      console.log('*** have NTY: ', thousands(haveWei))
      console.log('*** want USD: ', thousands(wantWei))
      this.props.sellVolatileToken(haveWei, wantWei)
    } catch (e) {
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
      } catch (e) {
        console.error(e)
        throw 'invalid amount'
      }
      try {
        const price = this.state.price;
        const haveAmount = mul(wantAmount, price);
        haveWei = nusdToWei(haveAmount);
      } catch (e) {
        console.error(e)
        throw 'invalid price'
      }
      if (haveWei === '0') {
        throw "amount or price too small"
      }
      console.log('*** have USD: ', thousands(haveWei))
      console.log('*** want NTY: ', thousands(wantWei))
      this.props.sellStableToken(haveWei, wantWei)
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
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

  absorb() {
    const amount = this.state.absorption;
    const wei = nusdToWei(amount);
    const zeroAddress = "0x0000000000000000000000000000000000000000"
    this.props.absorb(wei, zeroAddress);
  }

  absorbPeA() {
    const amount = this.state.absorption;
    const wei = nusdToWei(amount);
    this.props.absorb(wei, this.props.wallet);
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

toggleDebug(e) {
  this.setState({
    debug: !this.state.debug
  })
}

absorptionChange(e) {
  this.setState({
    absorption: e.target.value
  })
}

// Approve feature
amountToApproveChange(e) {
  this.setState({
    amountToApprove: e.target.value
  });
}

approve() {
  const token = this.tokenToApprove();
  const amountToApprove = this.state.amountToApprove;
  let amount;
  let isVolatileToken = token == 'MNTY';
  if (isVolatileToken) {
    amount = mntyToWei(amountToApprove);
  } else {
    amount = nusdToWei(amountToApprove);
  }
  this.props.approve(CONTRACTS.Seigniorage.address, amount, isVolatileToken);
}

allowanceRender() {
  const token = this.tokenToApprove();
  if (token === 'MNTY') {
    return thousands(weiToMNTY(this.props.volAllowance))
  } 
  if (token === 'NEWSD') {
    return thousands(weiToNUSD(this.props.stbAllowance))
  }
}

tokenToApprove() {
  if (this.state.absorption && this.state.absorption[0] === '-') {
    return 'NEWSD'
  } else {
    return 'MNTY'
  }
}

//// DEBUG ////

newsdToTransferChange(e) {
  this.setState({
    newsdToTransfer: e.target.value
  })
}

addressToTransferChange(e) {
  this.setState({
    addressToTransfer: e.target.value
  })
}

addressToTransferFromChange(e) {
  this.setState({
    addressToTransferFrom: e.target.value
  })
}

newsdTransfer() {
  const amount = nusdToWei(this.state.newsdToTransfer)
  const address = this.state.addressToTransfer
  this.props.newsdTransfer(address, amount)
}

newsdTransferFrom() {
  const amount = nusdToWei(this.state.newsdToTransfer)
  this.props.newsdTransferFrom(
    this.state.addressToTransferFrom,
    this.state.addressToTransfer,
    amount)
}

}
