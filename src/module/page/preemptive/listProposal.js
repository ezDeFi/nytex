import React, {useState}          from 'react';
import {Table}                    from 'antd'
import {useSelector, useDispatch} from "react-redux";
import store from '../../../store'

import './style/index.scss'
import preemptive                 from "../../../store/redux/preemptive";

const ListProposal = () => {
  const detailVote = useSelector(state => state.preemptive.detail_vote)
  const dispatch = useDispatch()
  const action = store.getRedux('preemptive').actions;

  const [dataSource, setDataSource] = useState([
    {
      key       : 1,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 2,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 3,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 4,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 5,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 6,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 7,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 8,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 9,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 10,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 11,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 12,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 13,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 14,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 15,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
    {
      key       : 16,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      choosing  : false
    },
  ]);

  const saleColumns = [
    {
      title    : 'Maker',
      dataIndex: 'maker',
      key      : 'maker',
      width    : 300,
      className: 'center',
      render   : (value, rowValue) => {
        if (value.length > 25) value = value.slice(0, 25) + '...'
        return renderStripedTable(value, rowValue)
      }
    },
    {
      title    : 'Absorption',
      dataIndex: 'absorption',
      key      : 'absorption',
      className: 'right-align',
      render   : (value, rowValue) => renderStripedTable(value, rowValue)
    },
    {
      title    : 'Rank',
      dataIndex: 'rank',
      key      : 'rank',
      className: 'right-align',
      render   : (value, rowValue) => renderStripedTable(value, rowValue)
    },
  ];

  const renderStripedTable = (value, rowValue) => {
    let bgColor = rowValue.key % 2 === 1 ? '#1F2538' : 'transparent'
    let color   = rowValue.choosing === true ? '#FAB416' : ''
    return <p style={{background: bgColor, color: color}}>{value}</p>
  }

  const showProposal = () => {
    let data = dataSource.map(item => {
      item.choosing = false;
      return item
    })
    setDataSource(data)
    dispatch(action.detail_vote_update(''))
  }

  return (
    <div className="list-proposals">
      <Table
        dataSource={dataSource}
        columns={saleColumns}
        pagination={false}
        scroll={{y: 210}}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              dispatch(action.detail_vote_update(record))
              let newDataSource = dataSource.map(item => {
                item.choosing = item.key === record.key;
                return item
              })
              setDataSource(newDataSource)
            }
          }
        }}
      />
      {
        detailVote &&
        <div className="right-align">
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
