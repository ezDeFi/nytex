import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import { cutString, thousands, weiToMNTY, weiToNUSD, decShift, mntyToWei, nusdToWei } from '../../../util/help.js'
import { DECIMALS } from '@/constant'

import './style.scss'

import { Col, Row, Icon, Button, Breadcrumb, Table, Input, InputNumber } from 'antd' // eslint-disable-line

export default class extends LoggedInPage {
  state = {
    stake: 200,
    amount: 100,
    slashingDuration: 0,
    lockdownExpiration: 0,
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
          <h3 className="text-center">Preemptive Absorption</h3>
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

            <h3 className="text-center">New Proposal</h3>

            <Row type="flex" align="middle" style={{ 'marginTop': '10px' }}>
              <Col span={8}>Stake (MNTY):</Col>
              <Col span={10}>
                <Input className="maxWidth"
                  defaultValue={0}
                  value={this.state.stake}
                  onChange={this.stakeChange.bind(this)}
                />
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                {thousands(weiToMNTY(this.props.globalParams.stake))}
              </Col>
            </Row>
            <Row type="flex" align="middle" style={{ 'marginTop': '10px' }}>
              <Col span={8}>Amount (NEWSD):</Col>
              <Col span={8}>
                <Input className="maxWidth"
                  defaultValue={0}
                  value={this.state.amount}
                  onChange={this.amountChange.bind(this)}
                />
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                {thousands(weiToMNTY(weiToMNTY(this.props.globalParams.rank)))}
              </Col>
            </Row>
            <Row type="flex" align="middle" style={{ 'marginTop': '10px' }}>
              <Col span={8}>Slashing Duration:</Col>
              <Col span={10}>
                <Input className="maxWidth"
                  defaultValue={0}
                  value={this.state.slashingDuration}
                  onChange={this.slashingDurationChange.bind(this)}
                />
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                {this.props.globalParams.slashingDuration}
              </Col>
            </Row>
            <Row type="flex" align="middle" style={{ 'marginTop': '10px' }}>
              <Col span={8}>Lockdown Expiration:</Col>
              <Col span={10}>
                <Input className="maxWidth"
                  defaultValue={0}
                  value={this.state.lockdownExpiration}
                  onChange={this.lockdownExpirationChange.bind(this)}
                />
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                {this.props.globalParams.lockdownExpiration}
              </Col>
            </Row>
            <Row style={{ 'marginTop': '8px' }}>
              <Col span={6} />
              <Col span={12}>
                <Button type="primary" onClick={() => this.propose()}
                  className="btn-margin-top submit-button maxWidth">Submit</Button>
              </Col>
            </Row>

            <Row style={{ 'marginTop': '15px' }}>
              <Col span={24}>
                {this.proposalsRender()}
              </Col>
            </Row>

            <Row style={{ 'marginTop': '8px' }}>
              <Col span={6} />
              <Col span={12}>
                <Button onClick={() => this.reload()}
                  className="btn-margin-top submit-button maxWidth">Reload</Button>
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
        <Breadcrumb.Item><Link to="/preemptive"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>preemptive</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

onCopy = () => {
  this.setState({copied: true});
};

proposalsRender() {
  //const data = [{'fromAmountWnty' : 0, 'toAmountWnty' : 1, 'fromAmountNusd' : 2, 'toAmountNusd' : 3}];
  const columns = [
    {
      title: 'Proposals',
      children: [
        {
          title: 'cancel',
          dataIndex: 'cancel',
          key: 'cancel',
          render: (text, record) => (
            <span>
              {record.maker.toLowerCase() === this.props.wallet &&
                <Button
                  onClick={() => this.props.revoke(record.maker)}
                  className="btn-margin-top submit-button maxWidth">
                    Revoke
                </Button>
              }
            </span>
          )
        },
        {
          title: 'maker',
          dataIndex: 'maker',
          key: 'maker',
          render: (text, record) => (
            <span>
              {cutString(record.maker)}
            </span>
          )
        },
        {
          title: 'stake',
          dataIndex: 'stake',
          key: 'stake',
        },
        {
          title: 'amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'SD',
          dataIndex: 'slashingDuration',
          key: 'slashingDuration',
        },
        {
          title: 'LE',
          dataIndex: 'lockdownExpiration',
          key: 'lockdownExpiration',
        },
        {
          title: 'TV',
          dataIndex: 'totalVote',
          key: 'totalVote',
        },
        {
          title: 'vote',
          dataIndex: 'vote',
          key: 'vote',
          render: (text, record) => (
            <span>
              {
                <span>
                  <Button onClick={() => this.props.vote(record.maker, true)}>UP</Button>
                  <Button onClick={() => this.props.vote(record.maker, false)}>DOWN</Button>
                </span>
              }
            </span>
          )
        },
      ]
    },
  ]
  return (<div>
    <Table rowKey="maker" dataSource={Object.values(this.props.proposals)} columns={columns} pagination={false} />
  </div>)
}

propose() {
  const stake = mntyToWei(this.state.stake, DECIMALS.mnty);
  const amount = nusdToWei(this.state.amount, DECIMALS.nusd);
  let slashingDuration = this.state.slashingDuration
  let lockdownExpiration = this.state.lockdownExpiration
  console.log('***** stake MNTY: ', thousands(weiToMNTY(stake)))
  console.log('*** amount NEWSD: ', thousands(weiToNUSD(amount)))
  this.props.propose(amount, stake, slashingDuration, lockdownExpiration)
}

reload() {
  this.props.reload();
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

stakeChange(e) {
  this.setState({
     stake: e.target.value
  })
}

amountChange(e) {
  this.setState({
    amount: e.target.value
  })
}

slashingDurationChange(e) {
  this.setState({
     slashingDuration: e.target.value
  })
}

lockdownExpirationChange(e) {
  this.setState({
     lockdownExpiration: e.target.value
  })
}

}
