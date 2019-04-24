import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import Footer from '@/module/layout/Footer/Container' // eslint-disable-line
import Tx from 'ethereumjs-tx' // eslint-disable-line
import { Link } from 'react-router-dom' // eslint-disable-line
import web3 from 'web3'

import './style.scss'

import { Col, Row, Icon, Button, Breadcrumb, Input, InputNumber } from 'antd' // eslint-disable-line

const weiToEther = (wei) => {
  return Number(web3.utils.fromWei(wei.toString())).toFixed(4)
}

export default class extends LoggedInPage {
  componentDidMount () {
    this.loadData()
  }

  loadData () {
    // this.props.getBalance()
    // this.props.getTokenBalance(this.props.currentAddress)
    // this.props.getDepositedBalance()
    // this.props.getStatus()
    // this.props.getCoinbase()
    // this.props.getAllowance()
  }

  getStatus (status) {
    switch (status) {
      case 0: return 'Ready'
      case 1: return 'Active'
      case 2: return 'Inactive'
      case 3: return 'Withdrawn'
      case 127: return 'Penalized'
      default: return 'Unknown'
    }
  }

  ord_renderContent () { // eslint-disable-line
    return (
      <div className="">
        <div className="ebp-header-divider">
        </div>

        <div className="ebp-page">
          <h3 className="text-center">Pool's Control</h3>
          <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{ 'textAlign': 'left' }}>

            <Row>
              <Col span={6}>
                            pool address:
              </Col>
              <Col span={6}>
                {this.props.address}
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                            signer address:
              </Col>
              <Col span={6}>
                {this.props.signer}
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                            owner:
              </Col>
              <Col span={6}>
                {this.props.owner}
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                            owner's balance:
              </Col>
              <Col span={6}>
                {weiToEther(this.props.ownerBalance)} NTY
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                            lockDuration / MAX:
              </Col>
              <Col span={6}>
                {this.props.lockDuration} / {this.props.maxLockDuration} second(s)
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                            Owner's actionDelay:
              </Col>
              <Col span={6}>
                {this.props.ownerDelay} second(s)
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                            fund:
              </Col>
              <Col span={6}>
                {weiToEther(this.props.fund)} NTY
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                NTY Balance:
              </Col>
              <Col span={6}>
                {weiToEther(this.props.poolNtyBalance)} NTY
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                NTF Balance:
              </Col>
              <Col span={6}>
                {weiToEther(this.props.poolNtfBalance)} NTF
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                Stake require:
              </Col>
              <Col span={6}>
                {weiToEther(this.props.stakeRequire)} NTF
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                Status:
              </Col>
              <Col span={6}>
                {this.getStatus(Number(this.props.poolStatus))}
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                Unlock / cur. Block:
              </Col>
              <Col span={6}>
                {this.props.unlockHeight} / {this.props.blockNumber}
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                Signer
              </Col>
              <Col span={18}>
                <Input
                  value={this.state.signer}
                  onChange={this.onSignerChange.bind(this)}
                />
              </Col>
            </Row>
            <Row style={{ 'marginTop': '15px' }}>
              <Col span={24}>
                <Button style={{ 'width': '100%' }} onClick={this.joinGov.bind(this)} type="primary" className="btn-margin-top submit-button">Join Gov</Button>
              </Col>
            </Row>
            <Row style={{ 'marginTop': '15px' }}>
              <Col span={24}>
                <Button style={{ 'width': '100%' }} onClick={this.leaveGov.bind(this)} type="primary" className="btn-margin-top submit-button">Leave Gov</Button>
              </Col>
            </Row>
            <Row style={{ 'marginTop': '15px' }}>
              <Col span={24}>
                <Button style={{ 'width': '100%' }} onClick={this.tokenPoolWithdraw.bind(this)} type="primary" className="btn-margin-top submit-button">Pool's Token Withdraw</Button>
              </Col>
            </Row>
            <Row style={{ 'marginTop': '15px' }}>
              <Col span={24}>
                <Button style={{ 'width': '100%' }} onClick={this.claimFund.bind(this)} type="primary" className="btn-margin-top submit-button">Claim Fund</Button>
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={6}>
                _lockDuration
              </Col>
              <Col span={18}>
                <InputNumber
                  style = {{'width' : '100%'}}
                  defaultValue = {0}
                  value={this.state.lockDuration}
                  onChange={this.onLockDurationChange.bind(this)}
                />
              </Col>
            </Row>
            <Row style={{ 'marginTop': '15px' }}>
              <Col span={24}>
                <Button style={{ 'width': '100%' }} onClick={this.setLockDuration.bind(this)} type="primary" className="btn-margin-top submit-button">Set lockDuration</Button>
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={24}>
                <Button style={{ 'width': '100%' }} onClick={this.virtuellMining.bind(this)} type="primary" className="btn-margin-top submit-button">Mining(virtuell) 3ETH</Button>
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
        <Breadcrumb.Item><Link to="/userdata"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Pool's Control</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

  onSignerChange (e) {
    this.setState({
      signer: e.target.value
    })
  }

  onLockDurationChange (value) {
    this.setState({
      lockDuration: value
    })
  }

  claimFund () {
    this.props.claimFund()
  }

  joinGov () {
    this.props.joinGov(this.state.signer)
  }

  leaveGov () {
    this.props.leaveGov()
  }

  tokenPoolWithdraw () {
    this.props.tokenPoolWithdraw()
  }
  
  setLockDuration () {
    this.props.setLockDuration(this.state.lockDuration)
  }

  virtuellMining () {
    this.props.virtuellMining()
  }
}
