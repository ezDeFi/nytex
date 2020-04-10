import React, {useState}          from 'react';
import {Table, Row, Col}          from 'antd'
import {
  UpOutlined,
  DownOutlined
}                                 from '@ant-design/icons';
import {useSelector, useDispatch} from "react-redux";
import store                      from '../../../store'
import preemptive                 from "../../../store/redux/preemptive";
import {thousands, weiToMNTY}     from '@/util/help.js'
import './style/index.scss'

const ListProposal = (props) => {
  const proposal          = useSelector(state => state.preemptive.proposal)
  const dispatch          = useDispatch()
  const action            = store.getRedux('preemptive').actions;
  const seigniorageAction = store.getRedux('seigniorage').actions;
  const proposals         = useSelector(state => state.seigniorage.proposals)
  const globalParams      = useSelector(state => state.seigniorage.globalParams)

  const [currentProposal, setCurrentProposal] = useState(null)

  const sellColumns = [
    {
      title    : 'Maker',
      dataIndex: 'maker',
      key      : 'maker',
      width    : 300,
      className: 'center hide-on-mobile',
      render   : (value, record) => {
        if (value.length > 25) value = value.slice(0, 25) + '...'
        return renderStripedTable(value, record)
      }
    },
    {
      title    : 'Absorption',
      dataIndex: 'amount',
      key      : 'amount',
      className: 'right-align hide-on-mobile',
      render   : (value, record) => renderStripedTable(value, record)
    },
    {
      title    : 'Rank',
      dataIndex: 'rank',
      key      : 'rank',
      className: 'right-align hide-on-mobile',
      style    : {width: 0},
      render   : (text, record) => {
        let rank = record.totalVote && globalParams.rank > 0 &&
          (BigInt(record.totalVote) * BigInt(record.stake) * BigInt(150) / BigInt(globalParams.rank)).toString() + '%'
        return renderStripedTable(rank, record)
      }
      // render   : (value, rowValue) => renderStripedTable('', rowValue)
    },
    {
      dataIndex: 'proposal-on-mobile',
      key      : 'proposal-on-mobile',
      className: 'right-align hide-on-desktop',
      render   : (value, object) => {
        console.log(object)
        return (
          <div className="list-proposal-mb-box">
            <Row className="list-proposal-mb">
              <Col xs={5} className="left-align list-proposal-mb__col-1">
                <p className="text-green">Marker</p>
                <p>Stake</p>
                <p>Absorption</p>
                <p>Total Vote</p>
              </Col>
              <Col xs={7} className="right-align list-proposal-mb__col-2">
                <p className="text-green">{object.maker.slice(0, 16)}</p>
                <p>{thousands(weiToMNTY(object.stake))}</p>
                <p>{object.amount}</p>
                <p>{thousands(weiToMNTY(object.totalVote))}</p>
              </Col>
              <Col xs={6} className="left-align list-proposal-mb__col-3">
                <p>Slashing Rate</p>
                <p>Rank</p>
                <p>Lockdown Expiration</p>
              </Col>
              <Col xs={3} className="right-align list-proposal-mb__col-4">
                <p>{object.slashingRate}</p>
                <p>{object.totalVote && globalParams.rank > 0 &&
                (BigInt(object.totalVote) * BigInt(object.stake) * BigInt(150) / BigInt(globalParams.rank)).toString()}%</p>
                <p>{object.lockdownExpiration}</p>
              </Col>
              <Col xs={3}>
                <p>vote</p>
                <div>
                  <button
                    className="list-proposal-mb__btn-up"
                    onClick={() => props.vote(object.maker, true)}
                  >
                    <UpOutlined/>
                  </button>
                </div>
                <div>
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
    },
  ];

  const renderStripedTable = (value, rowValue) => {
    let bgColor = rowValue.key % 2 === 1 ? '#1F2538' : 'transparent'
    let color   = rowValue.choosing === true ? '#FAB416' : ''
    return <p style={{background: bgColor, color: color}}>{value}</p>
  }

  const showProposal = () => {
    dispatch(action.proposal_update(''))
    let record      = currentProposal
    record.choosing = false
    dispatch(seigniorageAction.proposals_update({[record.maker]: record}))
    setCurrentProposal(null)
  }

  return (
    <div className="list-proposals">
      <Table
        dataSource={Object.values(proposals)}
        columns={sellColumns}
        pagination={false}
        scroll={{y: 270}}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              record.choosing = true
              setCurrentProposal(record)
              dispatch(seigniorageAction.proposals_update({[record.maker]: record}))
              dispatch(action.proposal_update(record))
            }
          }
        }}
      />
      {
        proposal &&
        <div className="right-align hide-on-mobile">
          <button
            className="btn-my-proposal"
            onClick={showProposal}>
            My proposal
          </button>
        </div>
      }
    </div>
  )
}

export default ListProposal
