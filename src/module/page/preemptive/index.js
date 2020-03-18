import React             from 'react';
import {Row, Col, Table} from 'antd'
import BasePage          from '../../page/StandardPage'
import ListProposal     from './listProposal'
import UserWallet     from './userWallet'
import VoteAbsorption     from './voteAbsorption'
import CreateProposal     from './createProposal'

import './style/index.scss'

const Preemptive = () => {
  return (
    <BasePage>
      <div className="preemptive">
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
        <div>
          <VoteAbsorption/>
        </div>
        <div>
          <CreateProposal/>
        </div>
      </div>
    </BasePage>
  )
}

export default Preemptive;
