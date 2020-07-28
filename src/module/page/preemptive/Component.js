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
    slashingRate: '',
    lockdownExpiration: '',
    volToApprove: '',
    stbToApprove: '',
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
                Native:
              </Col>
              <Col span={18}>
                {thousands(nty)} NTY
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                Total:
              </Col>
              <Col span={18}>
                {thousands(total)} NTY
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
                  placeholder={thousands(weiToMNTY(this.props.globalParams.stake))}
                  value={this.state.stake}
                  onChange={this.stakeChange.bind(this)}
                />
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <code>&gt; {thousands(weiToMNTY(this.props.globalParams.stake) * 2 / 3)}</code>
              </Col>
            </Row>
            <Row type="flex" align="middle" style={{ 'marginTop': '10px' }}>
              <Col span={8}>Absorption (NEWSD):</Col>
              <Col span={10}>
                <Input className="maxWidth"
                  defaultValue={0}
                  placeholder='+/- amount'
                  value={this.state.amount}
                  onChange={this.amountChange.bind(this)}
                />
              </Col>
            </Row>
            <Row type="flex" align="middle" style={{ 'marginTop': '10px' }}>
              <Col span={8}>Slashing Rate:</Col>
              <Col span={10}>
                <Input className="maxWidth"
                  defaultValue={0}
                  placeholder={decShift(this.props.globalParams.slashingRate, -18)}
                  value={this.state.slashingRate}
                  onChange={this.slashingRateChange.bind(this)}
                />
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <code>&gt; {(decShift(this.props.globalParams.slashingRate, -18) * 2 / 3).toFixed(4)}</code>
              </Col>
            </Row>
            <Row type="flex" align="middle" style={{ 'marginTop': '10px' }}>
              <Col span={8}>Lockdown Expiration:</Col>
              <Col span={10}>
                <Input className="maxWidth"
                  defaultValue={0}
                  placeholder={this.props.globalParams.lockdownExpiration + ' blocks'}
                  value={this.state.lockdownExpiration}
                  onChange={this.lockdownExpirationChange.bind(this)}
                />
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <code>&gt; {Math.floor(this.props.globalParams.lockdownExpiration * 2 / 3)}</code>
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

            {this.lockdownRender()}

            <h4 className="text-center">Allowance</h4>

            <Row type="flex" align="middle">
              <Col span={4}>
                MNTY:
              </Col>
              <Col span={8}>
                {thousands(weiToMNTY(this.props.volAllowance))}
              </Col>
              <Col span={8}>
                <Input className="maxWidth"
                  placeholder='MNTY'
                  defaultValue={0}
                  value={this.state.volToApprove}
                  onChange={this.volToApproveChange.bind(this)}
                />
              </Col>
              <Col span={4}>
                <Button onClick={() => this.approve(true)}
                  className="btn-margin-top submit-button maxWidth">Approve</Button>
              </Col>
            </Row>

            <Row type="flex" align="middle">
              <Col span={4}>
                NEWSD:
              </Col>
              <Col span={8}>
                {thousands(weiToNUSD(this.props.stbAllowance))}
              </Col>
              <Col span={8}>
                <Input className="maxWidth"
                  placeholder='NEWSD'
                  defaultValue={0}
                  value={this.state.stbToApprove}
                  onChange={this.stbToApproveChange.bind(this)}
                />
              </Col>
              <Col span={4}>
                <Button onClick={() => this.approve(false)}
                  className="btn-margin-top submit-button maxWidth">Approve</Button>
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
        <Breadcrumb.Item>preemptive</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

  onCopy = () => {
    this.setState({ copied: true });
  };

  lockdownRender() {
    const zeroAddress = "0x0000000000000000000000000000000000000000"
    if (!this.props.lockdown.maker || this.props.lockdown.maker === zeroAddress) {
      return
    }
    return (
      <div class='lockdown'>
        <h3 className="text-center">Lockdown</h3>
        <Row type="flex" align="middle">
          <Col span={24}>
            <span class='prop'>Maker({cutString(this.props.lockdown.maker)})</span>
            <span class='prop'>Stake({thousands(weiToMNTY(this.props.lockdown.stake))})</span>
            <span class='prop'>Amount({thousands(weiToNUSD(this.props.lockdown.amount))})</span>
            <span class='prop'>SlashingFactor({decShift(this.props.lockdown.slashingFactor, -18)})</span>
            <span class='prop'>UnlockNumber({this.props.lockdown.unlockNumber})</span>
          </Col>
        </Row>
      </div>
    )
  }

  proposalsRender() {
    //const data = [{'fromAmountWnty' : 0, 'toAmountWnty' : 1, 'fromAmountNusd' : 2, 'toAmountNusd' : 3}];
    const columns = [
      {
        title: 'Proposals',
        children: [
          {
            title: 'Maker',
            dataIndex: 'maker',
            key: 'maker',
            render: (text, record) => (
              (record.maker.toLowerCase() === this.props.wallet)
                ?
                <Button
                  onClick={() => this.props.revoke(record.maker)}
                  className="btn-margin-top submit-button maxWidth">
                  Revoke
                </Button>
                : <span>
                  {cutString(record.maker)}
                </span>
            )
          },
          {
            title: 'Stake',
            dataIndex: 'stake',
            key: 'stake',
            render: (text, record) => (
              <span>
                {thousands(weiToMNTY(text))}
              </span>
            )
          },
          {
            title: 'Absorption',
            dataIndex: 'amount',
            key: 'amount',
          },
          {
            title: 'Slashing Rate',
            dataIndex: 'slashingRate',
            key: 'slashingRate',
          },
          {
            title: 'Lockdown Expiration',
            dataIndex: 'lockdownExpiration',
            key: 'lockdownExpiration',
          },
          {
            title: 'Total Vote',
            dataIndex: 'totalVote',
            key: 'totalVote',
            render: (text, record) => (
              <span>
                {thousands(weiToMNTY(text))}
              </span>
            )
          },
          {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            render: (text, record) => (
              record.totalVote && this.props.globalParams.rank > 0 &&
              <span>{
                // rank = (totalVote * stake) / (2/3*globalRank)
                (BigInt(record.totalVote) * BigInt(record.stake) * BigInt(150) / BigInt(this.props.globalParams.rank)).toString()
              }%</span>
            )
          },
          {
            title: 'Vote',
            dataIndex: 'vote',
            key: 'vote',
            render: (text, record) => (
              <span>
                {text !== true && <Icon type='like' onClick={() => this.props.vote(record.maker, true)} />}
                {text !== false && <Icon type='dislike' onClick={() => this.props.vote(record.maker, false)} />}
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
    try {
      let stake, amount
      try {
        stake = BigInt(mntyToWei(this.state.stake.trim()))
      } catch (e) {
        console.error(e)
        throw 'invalid stake'
      }
      if (stake <= BigInt(this.props.globalParams.stake) * BigInt(2) / BigInt(3)) {
        throw "stake too small"
      }
      try {
        amount = BigInt(nusdToWei(this.state.amount.trim()))
      } catch (e) {
        console.error(e)
        throw 'invalid absorption amount'
      }
      if (!amount) {
        throw "absorption amount unspecified"
      }
      let slashingRate = this.state.slashingRate
      let lockdownExpiration = this.state.lockdownExpiration
      // if (slashingRate && (BigInt(slashingRate) * BigInt('1e18')) <= BigInt(this.props.globalParams.slashingRate) * 2 / 3) {
      //   throw "slashing rate too small"
      // }
      if (lockdownExpiration && lockdownExpiration <= this.props.globalParams.lockdownExpiration * 2 / 3) {
        throw "lockdown expiration too small"
      }
      this.props.propose(amount.toString(), stake.toString(), slashingRate, lockdownExpiration)
    } catch (e) {
      if (typeof e === 'string') {
        Modal.error({
          title: 'New Proposal',
          content: e,
          maskClosable: true,
        })
      } else {
        console.error(e)
        Modal.error({
          title: 'New Proposal',
          content: 'unable to propose',
          maskClosable: true,
        })
      }
    }
  }

  approve(isVolatileToken) {
    try {
      const amount = isVolatileToken ?
        mntyToWei(this.state.volToApprove.trim()) : nusdToWei(this.state.stbToApprove.trim());
      if (BigInt(amount) < 0) {
        throw "allowance cannot be negative"
      }
      try {
        this.props.approve(CONTRACTS.Seigniorage.address, amount, isVolatileToken);
      } catch (e) {
        if (typeof e === 'string') {
          Modal.error({
            title: 'Approve Allowance',
            content: e,
            maskClosable: true,
          })
        } else {
          console.error(e)
          Modal.error({
            title: 'Set Token Allowance',
            content: 'unable to approve allowance',
            maskClosable: true,
          })
        }
      }
    } catch (e) {
      if (typeof e === 'string') {
        Modal.error({
          title: 'Approve Allowance',
          content: e,
          maskClosable: true,
        })
      } else {
        console.error(e)
        Modal.error({
          title: 'Set Token Allowance',
          content: 'invalid amount',
          maskClosable: true,
        })
      }
    }
  }

  reload() {
    this.props.reload();
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

  slashingRateChange(e) {
    this.setState({
      slashingRate: e.target.value
    })
  }

  lockdownExpirationChange(e) {
    this.setState({
      lockdownExpiration: e.target.value
    })
  }

  volToApproveChange(e) {
    this.setState({
      volToApprove: e.target.value
    });
  }

  stbToApproveChange(e) {
    this.setState({
      stbToApprove: e.target.value
    });
  }

}