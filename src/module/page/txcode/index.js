import UserService               from '@/service/UserService'
import {Button, Col, Input, Row} from "antd";
import React, {useState}         from "react";
import {useSelector}             from "react-redux";
import BasePage                  from "../StandardPage";
import {thousands}               from '@/util/help.js'
import './style.scss'

var curWallet = null

const txcode = () => {
  const userService           = new UserService()
  const [addMore, setAddMore] = useState('')
  const balance               = useSelector(state => state.user.balance)
  const wallet                = useSelector(state => state.user.wallet)
  const readState             = useSelector(state => state.readWrite.readState)

  if (wallet !== curWallet && !curWallet) {
    userService.loadBlockNumber()
    userService.getBalance()
  }

  const send = () => {
    userService.sendTxCode( addMore)
  }

  return (
    <BasePage>
      <div className="">
        <div className="ebp-page">
          <h3 className="text-center">Dashboard</h3>
          <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{'textAlign': 'left'}}>

            <Row>
              <Col span={6}>
                Wallet:
              </Col>
              <Col span={6}>
                {wallet}
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                Balance:
              </Col>
              <Col span={18}>
                {thousands(balance)} NTY
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                readState:
              </Col>
              <Col span={18}>
                {readState}
              </Col>
            </Row>

            <div className="ebp-header-divider dashboard-rate-margin">
            </div>

            <h3 className="text-center">Write State</h3>

            <Row type="flex" align="middle" style={{'marginTop': '10px'}}>
              <Col span={10}>
                <Input className="maxWidth"
                       placeholder="Integer to add to State"
                       value={addMore}
                       onChange={e => setAddMore(e.target.value)}
                />
              </Col>
              <Col span={4}/>
              <Col span={10}>
                <Button type="primary" onClick={send}
                        className="btn-margin-top submit-button maxWidth">Send</Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </BasePage>
  )
}


export default txcode