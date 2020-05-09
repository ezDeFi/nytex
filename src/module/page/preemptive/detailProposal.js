import React, {useState}       from 'react';
import {Row, Col}              from 'antd'
import {useSelector}           from "react-redux";
import {thousands, weiToMNTY } from '@/util/help.js'
import I18N                    from '@/I18N'

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
        <h4 className="preemptive--header-2">{I18N.get('detail')}</h4>
      </div>
      <div className="absorption-content">
        <Row className="margin-bt-md">
          <Col lg={6}><b>{I18N.get('maker')}</b></Col>
          <Col lg={18}>{proposal.maker}</Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={6}><b>{I18N.get('stake_label')}</b></Col>
          <Col lg={18}>
            <Row>
              <Col lg={8}>{thousands(weiToMNTY(proposal.stake))} {I18N.get('million_nty')}</Col>
              <Col lg={6}><b>{I18N.get('total_vote')}</b></Col>
              <Col lg={10}>{thousands(weiToMNTY(proposal.totalVote))}</Col>
            </Row>
          </Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={6}><b>{I18N.get('absorption_label')}</b></Col>
          <Col lg={18}>
            <Row>
              <Col lg={8}>{proposal.amount} {I18N.get('newsd')}</Col>
              <Col lg={6}><b>{I18N.get('rank')}</b></Col>
              <Col lg={10}>{rank}</Col>
            </Row>
          </Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={6}><b>{I18N.get('slashing_rate_label')}</b></Col>
          <Col lg={18}>
            <Row>
              <Col lg={8}>{proposal.slashingRate}</Col>
              <Col lg={15}>
                <button className="absorption-content--vote-up" disabled={!enableVoteUp} onClick={voteUp}>{I18N.get('vote_up')}</button>
                <button className="absorption-content--vote-down" disabled={!enableVoteDown} onClick={voteDown}>{I18N.get('vote_down')}</button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg={6}><b>{I18N.get('lockdown_duration_label')}</b></Col>
          <Col lg={18}>
            <Row>
              <Col lg={8}>{proposal.lockdownExpiration}</Col>
              <Col lg={15}>
                {
                  userProposal &&
                  <button className="absorption-content--btn-revoke">{I18N.get('revoke')}</button>
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
