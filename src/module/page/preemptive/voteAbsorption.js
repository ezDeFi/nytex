import React   from 'react';
import {Row, Col, Input} from 'antd'
import ButOval from '../../Component/ButtonOval'

const VoteAbsorption = () => {
  return (
    <div className="absorption">
      <div className="center">
        <h3 className="preemptive--header-2">Detail</h3>
      </div>
      <div className="absorption-content">
        <Row className="margin-bt-md">
          <Col lg={4}><b>Maker</b></Col>
          <Col lg={9}>0x371Fd45453fCe637E6035779eE0a9eeE53665Ae9</Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4}><b>Stake:</b></Col>
          <Col lg={9}>
            <Row>
              <Col lg={10}>0 Million NTY</Col>
              <Col lg={7}><b>Total Vote:</b></Col>
              <Col lg={7}>1360</Col>
            </Row>
          </Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4}><b>Absorptiona:</b></Col>
          <Col lg={9}>
            <Row>
              <Col lg={10}>0 NewSD</Col>
              <Col lg={7}><b>Rank:</b></Col>
              <Col lg={7}>978</Col>
            </Row>
          </Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={4}><b>Slashing Rate</b></Col>
          <Col lg={9}>
            <Row>
              <Col lg={10}>1.0</Col>
              <Col lg={14}>
                <button className="absorption-content--vote-up">Vote up</button>
                <button className="absorption-content--vote-down">Vote Down</button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg={4}><b>Lockdown Duration:</b></Col>
          <Col lg={9}>
            <Row>
              <Col lg={10}>7 days</Col>
              <Col lg={14}><button className="absorption-content--btn-provoke">Provoke</button></Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default VoteAbsorption
