import React   from 'react';
import {Row, Col, Input} from 'antd'
import ButOval from '../../Component/ButtonOval'

const CreateProposal = () => {
  return (
    <div className="create-proposal-box">
      <div className="center">
        <h3 className="preemptive--header-2">Create Proposal</h3>
      </div>
      <div>
        <Row className="margin-bt-lg">
          <Col lg={4}>Marker:</Col>
          <Col lg={9}>0x371Fd45453fCe637E6035779eE0a9eeE53665Ae9</Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4}>Stake:</Col>
          <Col lg={9}><Input/></Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4}>Absorption:</Col>
          <Col lg={9}><Input/></Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4}>Slashing Rate:</Col>
          <Col lg={9}><Input/></Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4}>Lockdown Duration:</Col>
          <Col lg={9}><Input/></Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={{span:9, offset: 4}}>
            <button className="create-proposal--btn-submit">Submit</button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default CreateProposal
