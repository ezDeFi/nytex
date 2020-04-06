import React   from 'react';
import {Row, Col, Input} from 'antd'
import ButOval from '../../Component/ButtonOval'
import {useSelector, useDispatch}   from "react-redux";

const CreateProposal = () => {
  const wallet = useSelector(state => state.user.wallet)


  return (
    <div className="create-proposal-box ">
      <div className="center hide-on-mobile">
        <h3 className="preemptive--header-2">Create Proposal</h3>
      </div>
      <div>
        <Row className="margin-bt-lg hide-on-mobile">
          <Col lg={4}>Marker:</Col>
          <Col lg={9}>{wallet}</Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4} xs={10}>Stake (MNTY):</Col>
          <Col lg={9} xs={14}><Input/></Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4} xs={10}>Absorption (NEWSD):</Col>
          <Col lg={9} xs={14}><Input/></Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4} xs={10}>Slashing Rate:</Col>
          <Col lg={9} xs={14}><Input/></Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4} xs={10}>Lockdown Duration:</Col>
          <Col lg={9} xs={14}><Input/></Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={{span:9, offset: 4}} xs={{span: 14, offset:10}}>
            <button className="create-proposal--btn-submit">Submit</button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default CreateProposal
