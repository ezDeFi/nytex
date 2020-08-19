import React, { Fragment } from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import { thousands, weiToMNTY, weiToNUSD, } from '@/util/help.js'

import './style.scss'

import { Col, Row, Icon, Button, Breadcrumb, Input } from 'antd' // eslint-disable-line

const FIELD_KEYS = {
  FeeToken:         '0x466565546f6b656e000000000000000000000000000000000000000000000000',
  FeeTokenFallback: '0x466565546f6b656e46616c6c6261636b00000000000000000000000000000000',
}

const APP_TOKEN_KEY_PREFIX = '0x417070546f6b656e2d2d2d'

export default class extends LoggedInPage {
  state = {
  }

  async componentDidMount() {
    // this.reload()
  }

  renderField(field, name) {
    const address = this.state[`address-${field}`] 
    return (
      <Row type="flex" align="middle" style={{ 'marginTop': '20px' }}>
        <Col span={4}>{name || field}:</Col>
        <Col span={3}>{
          this.state[`symbol-${address}`] ||
          <Button onClick={() => this.queryField(field)}
            className="btn-margin-top submit-button maxWidth">Get</Button>
        }</Col>
        <Col span={14}>
          <Input className="maxWidth"
            placeholder={`${name || field} Address`}
            value={this.state[`address-${field}`]}
            onChange={(e) => this.changeFieldAddress(field, e.target.value)}
          />
        </Col>
        <Col span={3}>
          <Button onClick={() => this.pushField(field)}
            className="btn-margin-top submit-button maxWidth">Set</Button>
        </Col>
      </Row>
    )
  }

  changeFieldAddress(field, address) {
    if (address.startsWith('0x') && address.length > 42) {
      return
    }
    this.setFieldAddress(field, address)
  }

  setFieldAddress(field, address) {
    this.setState({
      [`address-${field}`]: address,
    })
    if (!this.state[`symbol-${address}`]) {
      if (address.startsWith('0x') && address.length == 42) {
        this.props.erc20Symbol(address).then(symbol =>
          this.setState({[`symbol-${address}`]: symbol}
        ))
      }
    }
  }

  queryField(field) {
    this.props.get(FIELD_KEYS[field]).then(value => {
      if (value.length < 3) {
        return
      }
      value = '0x' + value.substring(26)
      this.setFieldAddress(field, value)
    })
  }

  pushField(field) {
    const address = this.state[`address-${field}`]
    if (address.startsWith('0x') && address.length == 42) {
      const value = '0x000000000000000000000000' + address.substring(2)
      this.props.set(FIELD_KEYS[field], value).then(console.log)
    }
  }

  renderAppToken() {
    const address = this.state[`address-app`]
    return (<Fragment>
      <Row type="flex" align="middle" style={{ 'marginTop': '20px' }}>
        <Col span={7}>Recipient</Col>
        <Col span={14}>
          <Input className="maxWidth"
            placeholder='Recipient Address'
            value={this.state.keyAddress}
            onChange={(e) => this.changeKeyAddress(e.target.value)}
          />
        </Col>
      </Row>
      <Row type="flex" align="middle">
        <Col span={4}/>
        <Col span={3}>{
          this.state[`symbol-${address}`] ||
          <Button onClick={() => this.queryAppToken()}
            className="btn-margin-top submit-button maxWidth">Get</Button>
        }</Col>
        <Col span={14}>
          <Input className="maxWidth"
            placeholder='Token Address'
            value={this.state[`address-app`]}
            onChange={(e) => this.changeFieldAddress('app', e.target.value)}
          />
        </Col>
        <Col span={3}>
          <Button onClick={() => this.pushAppToken()}
            className="btn-margin-top submit-button maxWidth">Set</Button>
        </Col>
      </Row>
    </Fragment>)
  }

  changeKeyAddress(address) {
    if (address.startsWith('0x') && address.length > 42) {
      return
    }
    this.setState({
      keyAddress: address,
      ['address-app']: undefined,
    })
  }

  queryAppToken() {
    const address = this.state.keyAddress
    const key = APP_TOKEN_KEY_PREFIX + address.substring(2) + '00'
    this.props.get(key).then(value => {
      if (value.length < 3) {
        return
      }
      value = '0x' + value.substring(26)
      this.setFieldAddress('app', value)
    })
  }

  pushAppToken() {
    const keyAddress = this.state.keyAddress
    if (!keyAddress.startsWith('0x') || keyAddress.length != 42) {
      throw 'invalid recipient address'
    }
    const valueAddress = this.state[`address-app`]
    if (!valueAddress.startsWith('0x') || valueAddress.length != 42) {
      throw 'invalid token address'
    }
    const key = APP_TOKEN_KEY_PREFIX + keyAddress.substring(2) + '00'
    const value = '0x000000000000000000000000' + valueAddress.substring(2)
    this.props.set(key, value).then(console.log)
  }

  ord_renderContent () { // eslint-disable-line
    return (
      <div className="">
        <div className="ebp-header-divider">
        </div>

        <div className="ebp-page">
          <h3 className="text-center">Account Configuration</h3>
          <div className="ant-col-md-24 text-alert" style={{ 'textAlign': 'left' }}>

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
                {thousands(weiToMNTY(this.props.balance))} NTY
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                Deposited:
              </Col>
              <Col span={18}>
                {thousands(weiToMNTY(this.props.volatileTokenBalance))} WNTY
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

            <h3 className="text-center">Token Payment</h3>

            {this.renderField('FeeToken')}
            {this.renderAppToken()}
            {this.renderField('FeeTokenFallback', 'Fallback')}

          </div>
        </div>
      </div>
    )
  }

  ord_renderBreadcrumb () { // eslint-disable-line
    return (
      <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
        <Breadcrumb.Item><Link to="/home"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>config</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

  reload() {
    this.props.reload();
  }

}
