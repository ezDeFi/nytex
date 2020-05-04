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
import Asset                   from './asset'
import StableTokenService           from "../../../service/contracts/StableTokenService";
import VolatileTokenService         from "../../../service/contracts/VolatileTokenService";
import {setupWeb3}                  from "../../../util/auth";

const Preemptive = () => {
  const {TabPane}            = Tabs;
  const wallet               = useSelector(state => state.user.wallet)
  const showingProposal             = useSelector(state => state.preemptive.showingProposal)
  const volatileTokenBalance = useSelector(state => state.user.volatileTokenBalance)
  const balance              = useSelector(state => state.user.balance)
  const seigniorageService   = new SeigniorageService()
  const userService          = new UserService()
  const stableTokenService   = new StableTokenService()
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

  const vote = (maker, voteUp) => {
    seigniorageService.vote(maker, voteUp)
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
    let value  = undefined
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
          <div className="proposal">
            <div className="center">
              <h3 className="preemptive--header-2">Proposals</h3>
            </div>
            <Row>
              <Col lg={12}>
                <ListProposal />
              </Col>
              <Col lg={12}>
                <Asset approve={approve}/>
              </Col>
            </Row>
          </div>
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
        <Col lg={0} sm={0} xs={24}>
          <Asset/>
          <Tabs className="preemptive-tab">
            <TabPane tab="Proposals" key="1">
              <ListProposal vote={vote}/>
            </TabPane>
            <TabPane tab="New Proposal" key="2">
              <CreateProposal/>
            </TabPane>
          </Tabs>
        </Col>
      </Row>

    </BasePage>
  )
}

export default Preemptive;
