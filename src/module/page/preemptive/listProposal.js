import React          from 'react';
import {Table, Row, Col}          from 'antd'
import {useSelector, useDispatch} from "react-redux";
import store                      from '../../../store'
import preemptive                 from "../../../store/redux/preemptive";
import ProposalOnMobile from './proposalOnMobile'


const ListProposal = (props) => {
  const dispatch          = useDispatch()
  const action            = store.getRedux('preemptive').actions;
  const seigniorageAction = store.getRedux('seigniorage').actions;
  const proposals         = useSelector(state => state.seigniorage.proposals)
  const globalParams      = useSelector(state => state.seigniorage.globalParams)
  const showingProposal      = useSelector(state => state.preemptive.showingProposal)

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
    },
  ];

  const listProposalMobile = () => {
    let rows = []
    for(var i in proposals) {
      rows.push(<ProposalOnMobile vote={props.vote} key={i} proposal={proposals[i]}/>)
    }
    return rows
  }

  const renderStripedTable = (value, rowValue) => {
    let bgColor = rowValue.key % 2 === 1 ? '#1F2538' : 'transparent'
    let color   = rowValue.choosing === true ? '#FAB416' : ''
    return <p style={{background: bgColor, color: color}}>{value}</p>
  }

  return (
    <div className="list-proposals">
      <Row>
        <Col lg={24} sm={0}>
          <Table
            dataSource={Object.values(proposals)}
            columns={sellColumns}
            pagination={false}
            scroll={{y: 270}}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  if(showingProposal) {
                    dispatch(seigniorageAction.proposals_update({[showingProposal.maker]: {...showingProposal, choosing: false}}))
                  }
                  dispatch(action.showingProposal_update(record))
                  record.choosing = true
                  dispatch(seigniorageAction.proposals_update({[record.maker]: record}))
                }
              }
            }}
          />
        </Col>
        <Col lg={0} sm={24}>
          {listProposalMobile()}
        </Col>
      </Row>
    </div>
  )
}

export default ListProposal
