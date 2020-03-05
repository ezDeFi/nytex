import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
// import Sidebar from '../layout/Sidebar/Container' // eslint-disable-line
import { Link } from 'react-router-dom' // eslint-disable-line
import { thousands, weiToNTY, weiToMNTY, weiToNUSD, mntyToWei, nusdToWei, mul } from '@/util/help.js'
import { CONTRACTS } from '@/constant'
import './style.scss'

import { Checkbox, Button, Table, Input, Modal, Divider } from 'antd' // eslint-disable-line


const List_image = [
  { src: "/assets/images/target.svg", href: "https://#" },
  { src: "/assets/images/linear.svg", href: "https://#" },
  { src: "/assets/images/multi-linear.svg", href: "https://#" },
  { src: "/assets/images/brush.svg", href: "https://#" },
  { src: "/assets/images/text.svg", href: "https://#" },
  { src: "/assets/images/omni-linear.svg", href: "https://#" },
  { src: "/assets/images/switch.svg", href: "https://#" },
  { src: "/assets/images/previous.svg", href: "https://#" }
]

const List_image1 = [
  { src: "/assets/images/ruler.svg", href: "https://#" },
  { src: "/assets/images/zoom-in.svg", href: "https://#" }
]

const List_image2 = [
  { src: "/assets/images/magnet.svg", href: "https://#" },
  { src: "/assets/images/unlock-edit.svg", href: "https://#" },
  { src: "/assets/images/unlock.svg", href: "https://#" },
  { src: "/assets/images/view.svg", href: "https://#" }
]

const List_image3 = [
  { src: "/assets/images/layer.svg", href: "https://#" },
  { src: "/assets/images/trash.svg", href: "https://#" },
]



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
      <div id="exchangee">

        {this._renderTradingView()}

        {this._renderOrderBook()}

        {this._renderOpenOrder()}

        {this._renderOrderInterface()}

      </div>
    )
  }

  _renderTradingView() {
    return (
      <div className="trading_View">
        <div className="l_Navigation">
          <div className="l_NavigationA">
            <a style={{ marginLeft: '16px', marginRight: '25px' }} href="https://#">1 m</a>
            <a style={{ marginRight: '19px' }} href="https://#"><img src="\assets\images\candle-chart.svg" /></a>
            <a style={{ marginRight: '19px' }} href="https://#"><img src="\assets\images\line-chart.svg" /></a>
            <a style={{ marginRight: '19px' }} href="https://#">Indicator</a>
            <a style={{ marginRight: '19px' }} href="https://#"><img src="\assets\images\setting.svg" /></a>
            <a href="https://#"><img src="\assets\images\expand.svg" /></a>
          </div>
          <div className="l_NavigationB">
            <a style={{ marginRight: '18px' }} href="https://#">Trading View</a>
            <a style={{ marginRight: '10px' }} href="https://#">Depth </a>
          </div>
        </div>

        <div className="l_GraphToolbar">
          <ul className="l_Toolbar">
            {
              List_image.map((item, index) => {
                return (
                  <li key={item.src + index.toString()}><a href={item.href}><img src={item.src} /></a></li>
                )
              })
            }
            <div style={{ height: '2px', background: '#394462', margin: '15px 8px' }} />
            {
              List_image1.map((item, index) => {
                return (
                  <li key={item.src + index.toString()}><a href={item.href}><img src={item.src} /></a></li>
                )
              })
            }
            <div style={{ height: '2px', background: '#394462', margin: '15px 8px' }} />
            {
              List_image2.map((item, index) => {
                return (
                  <li key={item.src + index.toString()}><a href={item.href}><img src={item.src} /></a></li>
                )
              })
            }
            <div style={{ height: '2px', background: '#394462', margin: '15px 8px' }} />
            {
              List_image3.map((item, index) => {
                return (
                  <li key={item.src + index.toString()}><a href={item.href}><img src={item.src} /></a></li>
                )
              })
            }
          </ul>

          <div className="l_Graph">
            <div className="l_Price">
              Price
            </div>
            <div style={{ height: '2px', background: '#394462', margin: '10px' }} />
            <div className="l_Volume">
              Volume
            </div>
          </div>
        </div>
      </div >
    )
  }

  _renderOrderBook() {
    return (
      <div className="order_Book">

        <div className="r_Sellorder">
          <p>Orderbook</p>
          <ul style={{color: "#FAB416", textAlign:"start"}}>Price
            <li style={{color:"#FC4D5C"}}>0.02565</li>
          </ul>
          <ul style={{color: "#FAB416"}}>Amount
            <li>0.0025152</li>
          </ul>
          <ul style={{color: "#FAB416"}}>Volume
            <li>2.3764852</li>
          </ul>
        </div>

        <div className="r_Ledger">
          <ul style={{textAlign:"start"}}>Time
              <li style={{color:"#ffffff"}}>11:59:58</li>
          </ul>
          <ul>Price
              <li>0.0236295</li>
          </ul>
          <ul>Amount
              <li style={{color:"#ffffff"}}>0.1976000</li>
          </ul>
        </div>

        <div className="r_Buyorder">
          <div className="r_Price">
            <p style={{textAlign:"start", fontSize:"22px", color:"#ffffff"}}>0.02342</p>
            <p style={{textAlign:"end", lineHeight:"290%", color:"#ffffff"}}>$175.60602</p>
            <p style={{textAlign:"end", lineHeight:"290%", color:"#FC4D5C"}}>-1.69%</p>
          </div>

          <div className="r_BuyOrd">
            <ul style={{textAlign:"start"}}>
              <li style={{color:"#00C28E"}}>0.02383</li>
            </ul>
            <ul>
              <li style={{color:"#ffffff"}}>1.5124900</li>
            </ul>
            <ul>
              <li style={{color:"#ffffff"}}>0.2964000</li>
            </ul>
          </div>
        </div>

      </div>
    )
  }

  _renderOpenOrder() {
    return (
      <div className="open_Order">
        <div className="l_Index">
          <a style={{ fontWeight: '500', color: '#FAB416' }} href="https://#">Open Orders(5)</a>
          <a href="https://#">Order History</a>
          <a href="https://#">Trade History</a>
          <a href="https://#">Fund</a>
          <Checkbox className="l_Checkbox">Hide Other Pairs</Checkbox>
        </div>

        <div className="l_subIndex">
          <div>
            (Date search taskbar)
          </div>
        </div>

        <div className="l_Orders">
          <ul>Time
            <li>12-09 15:46:51</li>
          </ul>
          <ul>Side
            <li>Buy</li>
          </ul>
          <ul>Price
            <li>$110.00</li>
          </ul>
          <ul>Amount
            <li>1.000000</li>
          </ul>
          <ul>Filled (%)
            <li>5.00%</li>
          </ul>
          <ul>Total
            <li>100.00 ETH</li>
          </ul>
          <ul>Trigger Conditions
            <li>-</li>
          </ul>
          <ul style={{ textAlign: 'end' }}><button style={{ width: '66px' }}>Cancel All</button>
            <li><button style={{ width: '52px' }}>Cancel</button></li>
          </ul>
        </div>
      </div>
    )
  }

  _renderOrderInterface() {
    return (
      <div className="order_Interface">
        <form className="r_Buy">
          <p className="order_Title">Buy ETH</p>

          <p>Price:</p>
          <Input suffix="BTC" />

          <p>Amount:</p>
          <Input suffix="ETH" />
          <div className="order_Percentage">
            <a href="http://#">25% </a>
            <a href="http://#">50% </a>
            <a href="http://#">75% </a>
            <a href="http://#">100% </a>
          </div>

          <p>Total:</p>
          <Input suffix="ETH" />

          <Button>Buy</Button>
        </form>

        <div>
          <Divider className="order_divider" orientation="center" type="vertical" />
        </div>

        <form className="r_Sell">
          <p className="order_Title">Sell ETH</p>

          <p>Price:</p>
          <Input suffix="BTC" />

          <p>Amount:</p>
          <Input suffix="ETH" />
          <div className="order_Percentage">
            <a href="http://#">25% </a>
            <a href="http://#">50% </a>
            <a href="http://#">75% </a>
            <a href="http://#">100% </a>
          </div>

          <p>Total:</p>
          <Input suffix="BTC" />

          <Button>Sell</Button>
        </form>
      </div>
    )
  }

  // ord_renderBreadcrumb() { // eslint-disable-line
  //   return (
  //     <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
  //       <Breadcrumb.Item><Link to="/home"><Icon type="home" /> Home</Link></Breadcrumb.Item>
  //       <Breadcrumb.Item>exchange</Breadcrumb.Item>
  //     </Breadcrumb>
  //   )
  // }

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
