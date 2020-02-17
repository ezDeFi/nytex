import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import { thousands, weiToMNTY, weiToNUSD, } from '@/util/help.js'
import abiERC20 from '@/data/abi/erc20'

import './style.scss'

import { Col, Row, Icon, Button, Breadcrumb, Input } from 'antd' // eslint-disable-line

export default class extends LoggedInPage {
  state = {
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
          <h3 className="text-center">Wallet</h3>
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
              <Col span={18}>
                {thousands(weiToMNTY(this.props.balance))} Million NTY
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                Token:
              </Col>
              <Col span={18}>
                {thousands(weiToMNTY(this.props.volatileTokenBalance))} MNTY
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                StableCoin:
              </Col>
              <Col span={18}>
                {thousands(weiToNUSD(this.props.stableTokenBalance))} NEWSD
              </Col>
            </Row>

            <div className="ebp-header-divider dashboard-rate-margin">
            </div>

            <h3 className="text-center">ERC20</h3>

            <Row type="flex" align="middle" style={{ 'marginTop': '10px' }}>
              <Col span={4}>Address</Col>
              <Col span={20}>
                <Input className="maxWidth"
                  placeholder="0x..."
                  value={this.state.tokenAddress}
                  onChange={this.tokenAddressChange.bind(this)}
                />
              </Col>
            </Row>

            <Row>
              <Col span={6}>Name</Col>
              <Col span={18}>{this.state.tokenName}</Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }

  ord_renderBreadcrumb () { // eslint-disable-line
    return (
      <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
        <Breadcrumb.Item><Link to="/home"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>sample</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

call() {
  this.props.call(this.state.binary, this.state.tokenAddress);
}
  
send() {
  this.props.send(this.state.binary, this.state.tokenAddress);
}

reload() {
  this.props.reload();
}

binaryChange(e) {
  this.setState({
    binary: e.target.value
  })
}

tokenAddressChange(e) {
  const contract = web3.eth.
  this.setState({
    tokenAddress: e.target.value
  })
}

}
