import React, {useState}                                                      from 'react';
import {Row, Col, Input, Modal}                                                      from 'antd'
import ButOval                                                                from '../../Component/ButtonOval'
import {useSelector, useDispatch}                                             from "react-redux";
import {thousands, weiToNTY, weiToMNTY, weiToNUSD, mntyToWei, nusdToWei, mul} from '@/util/help.js'
import I18N from '@/I18N'

const CreateProposal = (props) => {
  const wallet                  = useSelector(state => state.user.wallet)
  const globalParams            = useSelector(state => state.seigniorage.globalParams)
  const [stake, setStake]       = useState('')
  const [amount, setAmount]     = useState('')
  const [slashing, setSlashing] = useState('')
  const [lockdown, setLockdown] = useState('')

  const createProposal = () => {
    try {
      let stakeValue, amountValue
      try {
        stakeValue = BigInt(mntyToWei(stake.trim()))
      } catch (e) {
        console.error(e)
        throw 'invalid stake'
      }
      if (stakeValue <= BigInt(globalParams.stake) * BigInt(2) / BigInt(3)) {
        throw "stake too small"
      }
      try {
        amountValue = BigInt(nusdToWei(amount.trim()))
      } catch (e) {
        console.error(e)
        throw 'invalid absorption amount'
      }
      if (!amountValue) {
        throw "absorption amount unspecified"
      }
      let slashingRate       = slashingRate
      let lockdownExpiration = lockdown
      if (slashingRate && slashingRate * 1000 <= globalParams.slashingRate * 2 / 3) {
        throw "slashing rate too small"
      }
      if (lockdownExpiration && lockdownExpiration <= globalParams.lockdownExpiration * 2 / 3) {
        throw "lockdown expiration too small"
      }
      console.log(lockdownExpiration)
      props.createProposal(amountValue.toString(), stakeValue.toString(), slashingRate, lockdownExpiration)
    } catch (e) {
      if (typeof e === 'string') {
        Modal.error({
          title       : 'New Proposal',
          content     : e,
          maskClosable: true,
        })
      } else {
        console.error(e)
        Modal.error({
          title       : 'New Proposal',
          content     : 'unable to propose',
          maskClosable: true,
        })
      }
    }
  }

  return (
    <div className="create-proposal-box ">
      <div className="center hide-on-mobile">
        <h4 className="preemptive--header-2">{I18N.get('create_proposal')}</h4>
      </div>
      <div>
        <Row className="margin-bt-lg hide-on-mobile">
          <Col lg={6}>{I18N.get('maker')}</Col>
          <Col lg={9}>{wallet}</Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={6} xs={10}>{I18N.get('stake_label')}:</Col>
          <Col lg={13} xs={14}>
            <Input
              value={stake}
              onChange={e => setStake(e.target.value)}
            />
          </Col>
          <Col lg={5} className="right-align">
            <code>> {thousands(weiToMNTY(globalParams.stake) * 2 / 3)}</code>
          </Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={6} xs={10}>{I18N.get('absorption_label')}:</Col>
          <Col lg={13} xs={14}>
            <Input
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={6} xs={10}>{I18N.get('slashing_rate_label')}:</Col>
          <Col lg={13} xs={14}>
            <Input
              value={slashing}
              onChange={e => setSlashing(e.target.value)}
            />
          </Col>
          <Col lg={5} className="right-align">
            <code>> {Math.floor(globalParams.slashingRate * 2 / 3) / 1000}</code>
          </Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={6} xs={10}>{I18N.get('lockdown_duration_label')}:</Col>
          <Col lg={13} xs={14}>
            <Input
              value={lockdown}
              onChange={e => setLockdown(e.target.value)}
            />
          </Col>
          <Col lg={5} className="right-align">
            <code>> {Math.floor(globalParams.lockdownExpiration * 2 / 3)}</code>
          </Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={{span: 9, offset: 6}} xs={{span: 14, offset: 10}}>
            <button
              className="create-proposal--btn-submit"
              onClick={createProposal}
            >
              {I18N.get('submit')}
            </button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default CreateProposal
