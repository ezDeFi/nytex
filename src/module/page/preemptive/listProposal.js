import React, {useState}          from 'react';
import {Table, Row, Col}                    from 'antd'
import {
  UpOutlined,
  DownOutlined
} from '@ant-design/icons';
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
      state: 50,
      choosing  : false
    },
    {
      key       : 2,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 3,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 4,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 5,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 6,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 7,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 8,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 9,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 10,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 11,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 12,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 13,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 14,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 15,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
    {
      key       : 16,
      maker     : '0x58E66ce774FE1bb7A901950abac450C8d756CD42',
      absorption: 0.00025152,
      rank      : 2.3764852,
      state: 50,
      choosing  : false
    },
  ]);

  const saleColumns = [
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
      dataIndex: 'absorption',
      key      : 'absorption',
      className: 'right-align hide-on-mobile',
      render   : (value, rowValue) => renderStripedTable(value, rowValue)
    },
    {
      title    : 'Rank',
      dataIndex: 'rank',
      key      : 'rank',
      className: 'right-align hide-on-mobile',
      render   : (value, rowValue) => renderStripedTable(value, rowValue)
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
                <div><button className="list-proposal-mb__btn-up"><UpOutlined /></button></div>
                <div><button className="list-proposal-mb__btn-down"><DownOutlined /></button></div>
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
        scroll={{y: 270}}
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
