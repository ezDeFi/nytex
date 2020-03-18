import React   from 'react';
import {Row, Col, Input} from 'antd'

const userWallet = () => {
  return (
    <div className="user-wallet">
      <p className="user-wallet--title"><b>My wallet</b></p>
      <div className="user-wallet--info">
        <Row className="margin-bt-sm">
          <Col lg={5}><b>Wallet</b></Col>
          <Col lg={19}>0x58E66ce774FE1bb7A901950abac450C8d756CD42</Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={5}><b>Balance</b></Col>
          <Col lg={19}>0 Milion NTY</Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={5}><b>Token</b></Col>
          <Col lg={19}>0 MNTY</Col>
        </Row>
        <Row className="margin-bt-sm">
          <Col lg={5}><b>StableCoin</b></Col>
          <Col lg={19}>0 NewSD</Col>
        </Row>
      </div>
      <div className="user-wallet--vote">
        <button className="btn-create-proposal">
          Create Proposal
        </button>
        <div className="user-absorption">
          <p className="user-absorption__header">
            <b>My Preemptive Absorption</b>
          </p>
          <Row className="user-absorption__content">
            <Col lg={6}><b>Allowance</b></Col>
            <Col lg={12}><Input suffix="BTC"/></Col>
            <Col lg={6} className="center">
              <button className="user-absorption__content--btn-approve">Approve</button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default userWallet
