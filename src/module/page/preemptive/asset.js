import React, {useState, useEffect}                            from 'react';
import {Row, Col, Input, Modal}                                from 'antd'
import {
  EditOutlined
}                                                              from '@ant-design/icons';
import {useSelector, useDispatch}                              from "react-redux";
import {thousands, weiToMNTY, weiToNUSD, mntyToWei, nusdToWei} from '@/util/help.js'
import store                                                   from "../../../store";
import I18N from '@/I18N'

const Allowance = (props) => {
  const dispatch = useDispatch()
  const [mntyAllowanceVisible, setMntyAllowanceVisible] = useState(false);
  const [newsdAllowanceVisible, setNewsdAllowanceVisible] = useState(false);
  const [volToApprove, setVolToApprove] = useState('');
  const [stbToApprove, setStbToApprove] = useState('');
  const volAllowance = useSelector(state => state.user.volAllowance)
  const stbAllowance = useSelector(state => state.user.stbAllowance)
  const userProposal = useSelector(state => state.preemptive.userProposal)
  const showingProposal = useSelector(state => state.preemptive.showingProposal)
  const seigniorageAction = store.getRedux('seigniorage').actions;
  const preemptiveAction = store.getRedux('preemptive').actions;

  const showUserProposal = () => {
    dispatch(seigniorageAction.proposals_update({[showingProposal.maker]: {...showingProposal, choosing: false}}))
    dispatch(seigniorageAction.proposals_update({[userProposal.maker]: {...userProposal, choosing: true}}))
    dispatch(preemptiveAction.showingProposal_update(userProposal))
  }

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
            title       : 'Approve Allowance',
            content     : e,
            maskClosable: true,
          })
        } else {
          console.error(e)
          Modal.error({
            title       : 'Set Token Allowance',
            content     : 'unable to approve allowance',
            maskClosable: true,
          })
        }
      }
    } catch (e) {
      if (typeof e === 'string') {
        Modal.error({
          title       : 'Approve Allowance',
          content     : e,
          maskClosable: true,
        })
      } else {
        console.error(e)
        Modal.error({
          title       : 'Set Token Allowance',
          content     : 'invalid amount',
          maskClosable: true,
        })
      }
    }
  }

  return (
    <div className="allowance">
      <p className="allowance__header">
        <b>{I18N.get('allowance')}</b>
      </p>
      <Row className="allowance__content">
        <Col lg={6}><b>{I18N.get('mnty')}:</b></Col>
        <Col lg={18} className="text-align--right">
          <span onClick={() => setMntyAllowanceVisible(true)}>
            {thousands(weiToMNTY(volAllowance))} <span
            className="hide-on-mobile">{I18N.get('mnty')}</span><span><EditOutlined/></span>
          </span>
        </Col>
      </Row>
      <Row className="allowance__content">
        <Col lg={6}><b>{I18N.get('newsd')}:</b></Col>
        <Col lg={18} className="text-align--right">
          <span onClick={() => setNewsdAllowanceVisible(true)}>
            {thousands(weiToNUSD(stbAllowance))} <span
            className="hide-on-mobile">{I18N.get('NewSd')}</span><span><EditOutlined/></span>
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
        <p className="allowance__modal--title"> {I18N.get('set_mnty_allowance')} </p>
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
            >{I18N.get('approve')}
            </button>
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
            >{I18N.get('approve')}
            </button>
          </Col>
        </Row>
      </Modal>
      {userProposal &&
        <Row><Col lg={24} xs={0}>
          <button
            className="btn-my-proposal" onClick={showUserProposal}>
            {I18N.get('my_proposal')}
          </button>
        </Col></Row>
      }
    </div>
  )
}

const asset = (props) => {
  const [createdProposal, setCreatedProposal] = useState(false);

  const dispatch = useDispatch()
  const preemptiveAction = store.getRedux('preemptive').actions;
  const seigniorageAction = store.getRedux('seigniorage').actions;
  const balance = useSelector(state => state.user.balance)
  const stableTokenBalance = useSelector(state => state.user.stableTokenBalance)
  const wallet = useSelector(state => state.user.wallet)
  const showingProposal = useSelector(state => state.preemptive.showingProposal)
  const userProposal = useSelector(state => state.preemptive.userProposal)

  useEffect(() => {
    setCreatedProposal(userProposal)
    dispatch(preemptiveAction.showingProposal_update(userProposal))
  }, [userProposal]);

  const showCreateForm = () => {
    if (showingProposal) {
      dispatch(seigniorageAction.proposals_update({[showingProposal.maker]: showingProposal}))
      dispatch(preemptiveAction.showingProposal_update(''))
    }
  }

  return (
    <Row className="user-wallet">
      <Col lg={24} md={24} xs={12} className="user-wallet__assets">
        <p className="assets--title"><b>{I18N.get('assets')}</b></p>
        <div className="assets__info-box">
          <Row className="assets__info hide-on-mobile">
            <Col lg={5} xs={5}><b>{I18N.get('wallet')}</b></Col>
            <Col lg={19}>{wallet}</Col>
          </Row>
          <Row className="assets__info">
            <Col lg={5} xs={5}>
              <b className="hide-on-mobile">{I18N.get('balance')}</b>
              <b className="hide-on-desktop">{I18N.get('nty')}</b>
            </Col>
            <Col lg={19} xs={19} className="assets__info--content">
              {thousands(weiToMNTY(balance))} <span className="hide-on-mobile">{I18N.get('million_nty')}</span>
            </Col>
          </Row>
          <Row className="assets__info">
            <Col lg={5} xs={5}>
              <b className="hide-on-mobile">{I18N.get('token')}</b>
              <b className="hide-on-desktop">{I18N.get('mnty')}</b>
            </Col>
            <Col lg={19} xs={19} className="assets__info--content">
              {thousands(weiToMNTY(balance))} <span className="hide-on-mobile">{I18N.get('mnty')}</span>
            </Col>
          </Row>
          <Row className="assets__info">
            <Col lg={5} xs={5}>
              <b className="hide-on-mobile">{I18N.get('stable_coin')}</b>
              <b className="hide-on-desktop">{I18N.get('newsd')}</b>
            </Col>
            <Col lg={19} xs={19} className="assets__info--content">
              {thousands(weiToNUSD(stableTokenBalance))} <span className="hide-on-mobile">{I18N.get('newsd')}</span>
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
            createdProposal ?
              <Allowance approve={props.approve}/>
              :
              <button className="btn-create-proposal" onClick={showCreateForm}>
                {I18N.get('create_proposal')}
              </button>
          }
        </div>
      </Col>
    </Row>
  )
}

export default asset
