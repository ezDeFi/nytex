import React, {useState}          from 'react';
import {Row, Col, Input, Modal}   from 'antd'
import {
  EditOutlined
}                                 from '@ant-design/icons';
import {useSelector, useDispatch} from "react-redux";
import {thousands, weiToNTY, weiToMNTY, weiToNUSD, mntyToWei, nusdToWei, mul} from '@/util/help.js'

const Allowance = (props) => {

  const [mntyAllowanceVisible, setMntyAllowanceVisible]   = useState(false);
  const [newsdAllowanceVisible, setNewsdAllowanceVisible] = useState(false);
  const [volToApprove, setVolToApprove] = useState('');
  const [stbToApprove, setStbToApprove] = useState('');

  const volAllowance = useSelector(state => state.user.volAllowance)
  const stbAllowance = useSelector(state => state.user.stbAllowance)

  const approve = (isVolatileToken) => {
    try {
      const amount = isVolatileToken ?
        mntyToWei(volToApprove.trim()) : nusdToWei(stbToApprove.trim());
      if (BigInt(amount) < 0) {
        throw "allowance cannot be negative"
      }
      try {
        console.log(props.approve)
        props.approve(amount, isVolatileToken);
      } catch (e) {
        if (typeof e === 'string') {
          Modal.error({
            title: 'Approve Allowance',
            content: e,
            maskClosable: true,
          })
        } else {
          console.error(e)
          Modal.error({
            title: 'Set Token Allowance',
            content: 'unable to approve allowance',
            maskClosable: true,
          })
        }
      }
    } catch (e) {
      if (typeof e === 'string') {
        Modal.error({
          title: 'Approve Allowance',
          content: e,
          maskClosable: true,
        })
      } else {
        console.error(e)
        Modal.error({
          title: 'Set Token Allowance',
          content: 'invalid amount',
          maskClosable: true,
        })
      }
    }
  }

  return (
    <div className="allowance">
      <p className="allowance__header">
        <b>Allowance</b>
      </p>
      <Row className="allowance__content">
        <Col lg={6}><b>MNTY:</b></Col>
        <Col lg={18} className="text-align--right">
          <span onClick={() => setMntyAllowanceVisible(true)}>
            {thousands(weiToMNTY(volAllowance))} <span className="hide-on-mobile">MNTY</span><span><EditOutlined/></span>
          </span>
        </Col>
      </Row>
      <Row className="allowance__content">
        <Col lg={6}><b>NewSD:</b></Col>
        <Col lg={18} className="text-align--right">
          <span onClick={() => setNewsdAllowanceVisible(true)}>
            {thousands(weiToNUSD(stbAllowance))} <span className="hide-on-mobile">NEWSD</span><span><EditOutlined/></span>
          </span>
        </Col>
      </Row>
      <Modal
        visible={mntyAllowanceVisible}
        onCancel={() => setMntyAllowanceVisible(false)}
        footer={null}
        title={null}
        closable={null}
      >
        <p className="allowance__modal--title"> Set Mnty Allowance </p>
        <Row className="allowance__modal--content">
          <Col span={14} offset={2}>
            <Input
              value={volToApprove}
              onChange={(e) => setVolToApprove(e.target.value)}
              type="text" className="allowance__modal--input"/>
          </Col>
          <Col span={6}>
            <button
              onClick={() => approve(true)}
              className="allowance__modal--btn-approve"
            >Approve</button>
          </Col>
        </Row>
      </Modal>
      <Modal
        visible={newsdAllowanceVisible}
        onCancel={() => setNewsdAllowanceVisible(false)}
        footer={null}
        title={null}
        closable={null}
      >
        <p className="allowance__modal--title"> Set NewSd Allowance </p>
        <Row className="allowance__modal--content">
          <Col span={14} offset={2}>
            <Input
              value={stbToApprove}
              onChange={(e) => setStbToApprove(e.target.value)}
              type="text" className="allowance__modal--input"/>
          </Col>
          <Col span={6}>
            <button
              onClick={() => approve(false)}
              className="allowance__modal--btn-approve"
            >Approve</button>
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

const userWallet = (props) => {
  const proposal         = useSelector(state => state.preemptive.proposal)
  const wallet           = useSelector(state => state.user.wallet)
  const balance          = useSelector(state => state.user.balance)
  let stableTokenBalance = useSelector(state => state.user.stableTokenBalance)

  return (
    <Row className="user-wallet">
      <Col lg={24} xs={12} className="user-wallet__assets">
        <p className="assets--title"><b>Assets</b></p>
        <div className="assets__info-box">
          <Row className="assets__info hide-on-mobile">
            <Col lg={5}><b>Wallet</b></Col>
            <Col lg={19}>{wallet}</Col>
          </Row>
          <Row className="assets__info">
            <Col lg={5} xs={5}>
              <b className="hide-on-mobile">Balance</b>
              <b className="hide-on-desktop">NTY</b>
            </Col>
            <Col lg={19} xs={19} className="assets__info--content">
              {thousands(weiToMNTY(balance))} <span className="hide-on-mobile">Milion NTY</span>
            </Col>
          </Row>
          <Row className="assets__info">
            <Col lg={5} xs={5}>
              <b className="hide-on-mobile">Token</b>
              <b className="hide-on-desktop">MNTY</b>
            </Col>
            <Col lg={19} xs={19} className="assets__info--content">
              {thousands(weiToMNTY(balance))} <span className="hide-on-mobile">MNTY</span>
            </Col>
          </Row>
          <Row className="assets__info">
            <Col lg={5} xs={5}>
              <b className="hide-on-mobile">StableCoin</b>
              <b className="hide-on-desktop">NewSD</b>
            </Col>
            <Col lg={19} xs={19} className="assets__info--content">
              {thousands(weiToNUSD(stableTokenBalance))} <span className="hide-on-mobile">NewSD</span>
            </Col>
          </Row>
        </div>
      </Col>
      <Col lg={24} xs={12} className="user-wallet__allowance">
        <div className="hide-on-desktop">
          <Allowance approve={props.approve}/>
        </div>
        <div className="user-wallet--allowance hide-on-mobile">
          {
            proposal ?
              <Allowance approve={props.approve}/>
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
