import React, {useEffect, useState} from 'react';
import {Row, Col, Table, Tabs}      from 'antd'
import BasePage                     from '../../page/StandardPage'
import ListProposal                 from './listProposal'
import DetailProposal               from './detailProposal'
import CreateProposal               from './createProposal'
import './style/index.scss'
import SeigniorageService           from "../../../service/contracts/SeigniorageService";
import UserService                  from "../../../service/UserService";
import {useSelector}                from "react-redux";
import Asset                        from './asset'
import StableTokenService           from "../../../service/contracts/StableTokenService";
import VolatileTokenService         from "../../../service/contracts/VolatileTokenService";
import {setupWeb3}      from "../../../util/auth";
import ProposalOnMobile from "./proposalOnMobile";
import I18N from '@/I18N'

const Preemptive = () => {
  const {TabPane} = Tabs;
  const wallet = useSelector(state => state.user.wallet)
  const showingProposal = useSelector(state => state.preemptive.showingProposal)
  const userProposal = useSelector(state => state.preemptive.userProposal)
  const volatileTokenBalance = useSelector(state => state.user.volatileTokenBalance)
  const balance = useSelector(state => state.user.balance)
  const seigniorageService = new SeigniorageService()
  const userService = new UserService()
  const stableTokenService = new StableTokenService()
  const volatileTokenService = new VolatileTokenService()

  useEffect(() => {
    const loadData = () => {
      seigniorageService.loadProposals()
      seigniorageService.loadProposalRealTime(loadVolatileTokenBalance, loadStableTokenBalance)
      userService.getBalance()
      volatileTokenService.loadMyVolatileTokenBalance()
      stableTokenService.loadMyStableTokenBalance()
    }

    if (window.ethereum) {
      setupWeb3(loadData)
    }
  }, [wallet]);

  const loadVolatileTokenBalance = () => {
    volatileTokenService.loadMyVolatileTokenBalance()
  }

  const loadStableTokenBalance = () => {
    stableTokenService.loadMyStableTokenBalance()
  }

  const vote = async (maker, voteUp) => {
    await seigniorageService.vote(maker, voteUp)
  }

  const approve = (amount, isVolatile) => {
    if (isVolatile) {
      return volatileTokenService.approve(amount)
    } else {
      return stableTokenService.approve(amount)
    }
  }

  const createProposal = (amount, stake, slashingRate, lockdownExpiration) => {
    const have = BigInt(stake)
    const mnty = BigInt(volatileTokenBalance)
    let value = undefined
    if (have > mnty) {
      value = (have - mnty)
      if (value > BigInt(balance)) {
        throw "insufficient fund to stake"
      }
      value = value.toString()
    }
    return volatileTokenService.propose(amount, stake, slashingRate, lockdownExpiration, value)
  }

  return (
    <BasePage>
      <Row className="preemptive">
        <Col lg={24} sm={24} xs={0}>
          <Row>
            <Col lg={12}>
              <h4 className="preemptive--header-2 center">{I18N.get('proposals')}</h4>
            </Col>
            <Col lg={12}>
              <h4 className="preemptive--header-2 padding-left-lg left-align">{I18N.get('my_wallet')}</h4>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="preemptive--left-site">
              <ListProposal/>
              {
                showingProposal ?
                  <div>
                    <DetailProposal vote={vote}/>
                  </div>
                  :
                  <div>
                    <CreateProposal createProposal={createProposal}/>
                  </div>
              }
            </Col>
            <Col lg={12} className="preemptive--right-site">
              <Asset approve={approve}/>
            </Col>
          </Row>
        </Col>
        <Col lg={0} sm={0} xs={24}>
          <Asset approve={approve}/>
          <Tabs className="preemptive-tab">
            <TabPane tab="Proposals" key="1">
              <ListProposal vote={vote}/>
            </TabPane>
            {
              userProposal ?
              <TabPane tab={I18N.get('my_proposal')} key="2">
                <ProposalOnMobile proposal={userProposal} />
              </TabPane>
                :
              <TabPane tab={I18N.get('new_proposal')} key="2">
                <CreateProposal createProposal={createProposal}/>
              </TabPane>
            }
          </Tabs>
        </Col>
      </Row>

    </BasePage>
  )
}

export default Preemptive;
