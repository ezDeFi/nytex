import React, {useState}                      from 'react';
import {Row, Col, Input}          from 'antd'
import ButOval                    from '../../Component/ButtonOval'
import {useSelector, useDispatch} from "react-redux";
import store                      from "../../../store";
import { cutString, thousands, weiToNTY, weiToMNTY, weiToNUSD, mntyToWei, nusdToWei, decShift } from '@/util/help.js'

const Detail = (props) => {
  const proposal = useSelector(state => state.preemptive.showingProposal)
  const userProposal = useSelector(state => state.preemptive.userProposal)
  const globalParams      = useSelector(state => state.seigniorage.globalParams)

  const rank = proposal.totalVote && globalParams.rank > 0 &&
    <span>{
      (BigInt(proposal.totalVote) * BigInt(proposal.stake) * BigInt(150) / BigInt(globalParams.rank)).toString()
    }%</span>

  const [enableVoteUp, setEnableVoteUp] = useState(true)
  const [enableVoteDown, setEnableVoteDown] = useState(true)

  const voteUp = async () => {
    setEnableVoteUp(false)
    try {
      await props.vote(proposal.maker, true)
      setEnableVoteUp(true)
    } catch (e) {
      console.log(e)
      setEnableVoteUp(true)
    }
  }

  const voteDown = async () => {
    setEnableVoteDown(false)
    try {
      await props.vote(proposal.maker, false)
      setEnableVoteDown(true)
    } catch (e) {
      console.log(e)
      setEnableVoteDown(true)
    }
  }

  return (
    <div className="absorption">
      <div className="center">
        <h4 className="preemptive--header-2">Detail</h4>
      </div>
      <div className="absorption-content">
        <Row className="margin-bt-md">
          <Col lg={6}><b>Maker</b></Col>
          <Col lg={18}>{proposal.maker}</Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={6}><b>Stake:</b></Col>
          <Col lg={18}>
            <Row>
              <Col lg={8}>{thousands(weiToMNTY(proposal.stake))} Million NTY</Col>
              <Col lg={6}><b>Total Vote:</b></Col>
              <Col lg={10}>{thousands(weiToMNTY(proposal.totalVote))}</Col>
            </Row>
          </Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={6}><b>Absorptiona:</b></Col>
          <Col lg={18}>
            <Row>
              <Col lg={8}>{proposal.amount} NewSD</Col>
              <Col lg={6}><b>Rank:</b></Col>
              <Col lg={10}>{rank}</Col>
            </Row>
          </Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={6}><b>Slashing Rate</b></Col>
          <Col lg={18}>
            <Row>
              <Col lg={8}>{proposal.slashingRate}</Col>
              <Col lg={15}>
                <button className="absorption-content--vote-up" disabled={!enableVoteUp} onClick={voteUp}>Vote up</button>
                <button className="absorption-content--vote-down" disabled={!enableVoteDown} onClick={voteDown}>Vote Down</button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg={6}><b>Lockdown Duration:</b></Col>
          <Col lg={18}>
            <Row>
              <Col lg={8}>{proposal.lockdownExpiration}</Col>
              <Col lg={15}>
                {
                  userProposal &&
                  <button className="absorption-content--btn-revoke">Revoke</button>
                }
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Detail
