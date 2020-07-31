import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import { cutString, thousands, weiToNTY, weiToMNTY, weiToNUSD, mntyToWei, nusdToWei, decShift } from '@/util/help.js'
import { CONTRACTS } from '@/constant'
import BigInt from 'big-integer';
import './style.scss'

import { Col, Row, Icon, Button, Breadcrumb, Table, Input, Modal } from 'antd' // eslint-disable-line

export default class extends LoggedInPage {
  state = {
    stake: '',
    amount: '',
  }

  async componentDidMount() {
    // this.reload()
  }

  ord_renderContent() { // eslint-disable-line
    const mnty = Number(weiToMNTY(this.props.volatileTokenBalance))
    const nty = Number(weiToNTY(this.props.balance))
    const total = mnty + nty
    return (
      <div className="">
        <div className="ebp-header-divider">
        </div>

        <div className="ebp-page">
          <h3 className="text-center">Governance</h3>
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
                Balance:
              </Col>

              <Col span={15}>
                {thousands(weiToMNTY(this.props.balance))} NTY
              </Col>

              <Col span={5}>
                <Button
                  onClick={() => this.deposit()}
                  className="btn-margin-top submit-button maxWidth">
                  Deposit
                </Button>
              </Col>
            </Row>

            <Row>
              <Col span={4}>
                Deposited:
              </Col>

              <Col span={7}>
                {thousands(total)} NTY
              </Col>

              <Col span={8}>
                <Input className="maxWidth"
                  placeholder="NTY to convert"
                  defaultValue={0}
                  value={this.state.mnty}
                  onChange={this.mntyChange.bind(this)}
                />
              </Col>
              <Col span={5}>
                <Button onClick={() => this.withdraw()}
                  className="btn-margin-top submit-button maxWidth">
                  Withdraw
                </Button>
              </Col>
            </Row>

            <div className="ebp-header-divider dashboard-rate-margin">
            </div>
          </div>
        </div>
      </div>
    )
  }

  ord_renderBreadcrumb() { // eslint-disable-line
    return (
      <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
        <Breadcrumb.Item><Link to="/home"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>governance</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

  reload() {
    this.props.reload();
  }

  mntyChange(e) {
    this.setState({
      mnty: e.target.value
    })
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
}