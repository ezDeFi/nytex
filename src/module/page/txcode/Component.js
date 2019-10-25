import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import { thousands, weiToMNTY, weiToNUSD, } from '@/util/help.js'

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

            <h3 className="text-center">Transaction Code</h3>

            <Row type="flex" align="middle" style={{ 'marginTop': '10px' }}>
              <Col span={4}>Max Value</Col>
              <Col span={20}>
                <Input className="maxWidth"
                  placeholder="maximum coin to spent by this tx code"
                  value={this.state.maxValue}
                  onChange={this.maxValueChange.bind(this)}
                />
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={4}>
                Binary
              </Col>
              <Col span={20}>
                <Input.TextArea className="maxWidth"
                  placeholder="runtime binary compiled by solc --bin-runtime"
                  value={this.state.binary}
                  onChange={this.binaryChange.bind(this)}
                  rows={13}
                />
              </Col>
            </Row>

            <Row style={{ 'marginTop': '8px' }}>
              <Col span={5} />
              <Col span={8}>
                <Button onClick={() => this.call()}
                  className="btn-margin-top submit-button maxWidth">Call</Button>
              </Col>
              <Col span={2} />
              <Col span={8}>
                <Button type="primary" onClick={() => this.send()}
                  className="btn-margin-top submit-button maxWidth">Send</Button>
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
        <Breadcrumb.Item><Link to="/home"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>txcode</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

call() {
  this.props.call(this.state.binary, this.state.maxValue);
}
  
send() {
  this.props.send(this.state.binary, this.state.maxValue);
}

reload() {
  this.props.reload();
}

binaryChange(e) {
  this.setState({
    binary: e.target.value
  })
}

maxValueChange(e) {
  this.setState({
    maxValue: e.target.value
  })
}

}
