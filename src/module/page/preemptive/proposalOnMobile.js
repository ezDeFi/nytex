import React                  from 'react';
import {Row, Col}             from 'antd'
import {
  UpOutlined,
  DownOutlined
}                             from '@ant-design/icons';
import {thousands, weiToMNTY} from '@/util/help.js'
import {useSelector}          from "react-redux";
import I18N                    from '@/I18N'

const ProposalOnMobile = (props) => {
  let object = props.proposal
  const globalParams      = useSelector(state => state.seigniorage.globalParams)

  return (
    <div className="list-proposal-mb-box">
    <Row className="list-proposal-mb">
      <Col xs={5} className="left-align list-proposal-mb__col-1">
        <p className="text-green">{I18N.get('maker')}</p>
        <p>{I18N.get('stake')}</p>
        <p>{I18N.get('absorption')}</p>
        <p>{I18N.get('total_vote')}</p>
      </Col>
      <Col xs={7} className="right-align list-proposal-mb__col-2">
        <p className="text-green">{object.maker.slice(0, 16)}</p>
        <p>{thousands(weiToMNTY(object.stake))}</p>
        <p>{object.amount}</p>
        <p>{thousands(weiToMNTY(object.totalVote))}</p>
      </Col>
      <Col xs={6} className="left-align list-proposal-mb__col-3">
        <p>{I18N.get('slashing_rate_label')}</p>
        <p>{I18N.get('rank')}</p>
        <p>{I18N.get('lockdown_duration_label')}</p>
      </Col>
      <Col xs={3} className="right-align list-proposal-mb__col-4">
        <p>{object.slashingRate}</p>
        <p>{object.totalVote && globalParams.rank > 0 &&
        (BigInt(object.totalVote) * BigInt(object.stake) * BigInt(150) / BigInt(globalParams.rank)).toString()}%</p>
        <p>{object.lockdownExpiration}</p>
      </Col>
      <Col xs={3}>
        <p className="text-white right-align">{I18N.get('vote')}</p>
        <div className="right-align">
          <button
            className="list-proposal-mb__btn-up"
            onClick={() => props.vote(object.maker, true)}
          >
            <UpOutlined/>
          </button>
        </div>
        <div className="right-align">
          <button
            className="list-proposal-mb__btn-down"
            onClick={() => props.vote(object.maker, false)}
          >
            <DownOutlined/>
          </button>
        </div>
      </Col>
    </Row>
  </div>
  )
}

export default ProposalOnMobile
