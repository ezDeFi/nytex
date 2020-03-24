import React, {useState}             from 'react';
import {Row, Col, Input, Modal} from 'antd'
import {
  EditOutlined
} from '@ant-design/icons';
import {useSelector}     from "react-redux";


const Allowance = () => {

  const [mntyAllowanceVisible, setMntyAllowanceVisible] = useState(false);
  const [newsdAllowanceVisible, setNewsdAllowanceVisible] = useState(false);

  const handleCancelMntyAllowance = () => {
    setMntyAllowanceVisible( false );
  };

  return (
    <div className="allowance">
      <p className="allowance__header">
        <b>Allowance</b>
      </p>
      <Row className="allowance__content">
        <Col lg={6}><b>MNTY:</b></Col>
        <Col lg={18} className="text-align--right">
          <span onClick={() => setMntyAllowanceVisible(true)}>
            1,000,000,000.1234 <span className="hide-on-mobile">MNTY</span><span><EditOutlined /></span>
          </span>
        </Col>
      </Row>
      <Row className="allowance__content">
        <Col lg={6}><b>NewSD:</b></Col>
        <Col lg={18} className="text-align--right">
          <span onClick={() => setNewsdAllowanceVisible(true)}>
            1,000.3215 <span className="hide-on-mobile">NEWSD</span><span><EditOutlined /></span>
          </span>
        </Col>
      </Row>
      <Modal
        visible={mntyAllowanceVisible}
        onCancel={() => setMntyAllowanceVisible( false )}
        footer={null}
        title = {null}
        closable={null}
      >
        <p className="allowance__modal--title"> Set Mnty Allowance </p>
        <Row className="allowance__modal--content">
          <Col span={14} offset={2}><Input type="text" className="allowance__modal--input"/></Col>
          <Col span={6}><button className="allowance__modal--btn-approve">Approve</button></Col>
        </Row>
      </Modal>
      <Modal
        visible={newsdAllowanceVisible}
        onCancel={() => setNewsdAllowanceVisible(false)}
        footer={null}
        title = {null}
        closable={null}
      >
        <p className="allowance__modal--title"> Set NewSd Allowance </p>
        <Row className="allowance__modal--content">
          <Col span={14} offset={2}><Input type="text" className="allowance__modal--input"/></Col>
          <Col span={6}><button className="allowance__modal--btn-approve">Approve</button></Col>
        </Row>
      </Modal>
    </div>
  )
}

const userWallet = () => {
  const detailVote = useSelector(state => state.preemptive.detail_vote)

  return (
    <Row className="user-wallet">
      <Col lg={24} xs={12} className="user-wallet__assets">
        <p className="assets--title"><b>Assets</b></p>
        <div className="assets__info-box">
          <Row className="assets__info hide-on-mobile">
            <Col lg={5}><b>Wallet</b></Col>
            <Col lg={19}>0x58E66ce774FE1bb7A901950abac450C8d756CD42</Col>
          </Row>
          <Row className="assets__info">
            <Col lg={5} xs={5}>
              <b className="hide-on-mobile">Balance</b>
              <b className="hide-on-desktop">NTY</b>
            </Col>
            <Col lg={19} xs={19} className="assets__info--content">
              0 <span className="hide-on-mobile">Milion NTY</span>
            </Col>
          </Row>
          <Row className="assets__info">
            <Col lg={5} xs={5}>
              <b className="hide-on-mobile">Token</b>
              <b className="hide-on-desktop">MNTY</b>
            </Col>
            <Col lg={19} xs={19} className="assets__info--content">
              0 <span className="hide-on-mobile">MNTY</span>
            </Col>
          </Row>
          <Row className="assets__info">
            <Col lg={5} xs={5}>
              <b className="hide-on-mobile">StableCoin</b>
              <b className="hide-on-desktop">NewSD</b>
            </Col>
            <Col lg={19} xs={19} className="assets__info--content">
              0 <span className="hide-on-mobile">NewSD</span>
            </Col>
          </Row>
        </div>
      </Col>
      <Col lg={24} xs={12} className="user-wallet__allowance">
        <div className="hide-on-desktop">
          <Allowance/>
        </div>
        <div className="user-wallet--allowance hide-on-mobile">
          {
            detailVote ?
            <Allowance/>
            :
            <button className="btn-create-proposal">
              Create Proposal
            </button>
          }
        </div>
      </Col>
    </Row>
  )
}

export default userWallet
