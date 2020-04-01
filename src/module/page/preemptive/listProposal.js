import React, {useState} from 'react';
import {Table, Row, Col}            from 'antd'
import {
  UpOutlined,
  DownOutlined
}                                   from '@ant-design/icons';
import {useSelector, useDispatch}   from "react-redux";
import store                        from '../../../store'
import preemptive                   from "../../../store/redux/preemptive";
import './style/index.scss'

const ListProposal = () => {
  const proposal        = useSelector(state => state.preemptive.proposal)
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
      render   : (value, rowValue) => {
        if (value.length > 25) value = value.slice(0, 25) + '...'
        return renderStripedTable(value, rowValue)
      }
    },
    {
      title    : 'Absorption',
      dataIndex: 'amount',
      key      : 'amount',
      className: 'right-align hide-on-mobile',
      render   : (value, rowValue) => renderStripedTable(value, rowValue)
    },
    {
      title    : 'Rank',
      dataIndex: 'rank',
      key      : 'rank',
      className: 'right-align hide-on-mobile',
      render   : (text, record) => (
        record.totalVote && globalParams.rank > 0 &&
        <span>{
          // rank = (totalVote * stake) / (2/3*globalRank)
          (BigInt(record.totalVote) * BigInt(record.stake) * BigInt(150) / BigInt(globalParams.rank)).toString()
        }%</span>
      )
      // render   : (value, rowValue) => renderStripedTable('', rowValue)
    },
    {
      dataIndex: 'proposal-on-mobile',
      key      : 'proposal-on-mobile',
      className: 'right-align hide-on-desktop',
      render   : (value, object) => {
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
                <p className="text-green">0x12312345sda12</p>
                <p>{object.state}</p>
                <p>{object.absorption}</p>
                <p>total vote</p>
              </Col>
              <Col xs={6} className="left-align list-proposal-mb__col-3">
                <p>Slashing Rate</p>
                <p>Rank</p>
                <p>Lockdown Expiration</p>
              </Col>
              <Col xs={3} className="right-align list-proposal-mb__col-4">
                <p>100%</p>
                <p>557.89</p>
                <p>403.201</p>
              </Col>
              <Col xs={3}>
                <p>vote</p>
                <div>
                  <button className="list-proposal-mb__btn-up"><UpOutlined/></button>
                </div>
                <div>
                  <button className="list-proposal-mb__btn-down"><DownOutlined/></button>
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
