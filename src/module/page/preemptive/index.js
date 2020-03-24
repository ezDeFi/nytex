import React                   from 'react';
import {Row, Col, Table, Tabs} from 'antd'
import BasePage                from '../../page/StandardPage'
import ListProposal            from './listProposal'
import UserWallet              from './userWallet'
import VoteAbsorption          from './voteAbsorption'
import CreateProposal          from './createProposal'
import './style/index.scss'
import {useSelector}           from "react-redux";

const Preemptive = () => {
  const {TabPane} = Tabs;
  const detailVote = useSelector(state => state.preemptive.detail_vote)

  return (
    <BasePage>
      <Row className="preemptive">
        <Col lg={24} xs={0}>
          <div className="proposal">
            <div className="center">
              <h3 className="preemptive--header-2">Proposals</h3>
            </div>
            <Row>
              <Col lg={12}>
                <ListProposal/>
              </Col>
              <Col lg={12}>
                <UserWallet/>
              </Col>
            </Row>
          </div>
          {
            detailVote ?
            <div>
              <VoteAbsorption/>
            </div>
              :
            <div>
              <CreateProposal/>
            </div>
          }
        </Col>
        <Col lg={0} xs={24}>
          <UserWallet/>
          <Tabs className="preemptive-tab">
            <TabPane tab="Open Orders" key="1">
              <ListProposal/>
            </TabPane>
            <TabPane tab="Open History" key="2">
              <CreateProposal/>
            </TabPane>
          </Tabs>
        </Col>
      </Row>

    </BasePage>
  )
}

export default Preemptive;
