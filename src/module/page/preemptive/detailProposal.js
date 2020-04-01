import React                      from 'react';
import {Row, Col, Input}          from 'antd'
import ButOval                    from '../../Component/ButtonOval'
import {useSelector, useDispatch} from "react-redux";
import store                      from "../../../store";
import { cutString, thousands, weiToNTY, weiToMNTY, weiToNUSD, mntyToWei, nusdToWei, decShift } from '@/util/help.js'

const Detail = (props) => {
  const proposal = useSelector(state => state.preemptive.proposal)
  const action     = store.getRedux('preemptive').actions;
  const globalParams      = useSelector(state => state.seigniorage.globalParams)

  const rank = proposal.totalVote && globalParams.rank > 0 &&
    <span>{
      // rank = (totalVote * stake) / (2/3*globalRank)
      (BigInt(proposal.totalVote) * BigInt(proposal.stake) * BigInt(150) / BigInt(globalParams.rank)).toString()
    }%</span>

  return (
    <div className="absorption">
      <div className="center">
        <h3 className="preemptive--header-2">Detail</h3>
      </div>
      <div className="absorption-content">
        <Row className="margin-bt-md">
          <Col lg={4}><b>Maker</b></Col>
          <Col lg={20}>{proposal.maker}</Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4}><b>Stake:</b></Col>
          <Col lg={20}>
            <Row>
              <Col lg={5}>{thousands(weiToMNTY(proposal.stake))} Million NTY</Col>
              <Col lg={4}><b>Total Vote:</b></Col>
              <Col lg={15}>{thousands(weiToMNTY(proposal.totalVote))}</Col>
            </Row>
          </Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4}><b>Absorptiona:</b></Col>
          <Col lg={20}>
            <Row>
              <Col lg={5}>{proposal.amount} NewSD</Col>
              <Col lg={4}><b>Rank:</b></Col>
              <Col lg={15}>{rank}</Col>
            </Row>
          </Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4}><b>Slashing Rate</b></Col>
          <Col lg={20}>
            <Row>
              <Col lg={5}>{proposal.slashingRate}</Col>
              <Col lg={19}>
                <button className="absorption-content--vote-up" onClick={() => props.vote(proposal.maker, true)}>Vote up</button>
                <button className="absorption-content--vote-down" onClick={() => props.vote(proposal.maker, false)}>Vote Down</button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg={4}><b>Lockdown Duration:</b></Col>
          <Col lg={20}>
            <Row>
              <Col lg={5}>7 days</Col>
              <Col lg={19}>
                <button className="absorption-content--btn-provoke">Provoke</button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Detail
