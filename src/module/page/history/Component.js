import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import './style.scss'
import axios from 'axios'

import { Col, Row, Icon, Button, Breadcrumb, Table, Input, Modal } from 'antd' // eslint-disable-line

export default class extends LoggedInPage {
  constructor(props) {
    super(props);


    this.state = {
      BlockNumber: ''
    }
}

  async componentDidMount() {
    // this.reload()
  }

  ord_renderContent () { // eslint-disable-line
    return (
      <div className="">
        <div className="ebp-header-divider">
        </div>
        <div className="ebp-page">
          <h3 className="text-center">Find data</h3>
          <Row>
            <Col span={3} />
            <Col span={4}>
              Insert block number:
            </Col>
            <Col span={8}>
              <Input className="maxWidth"
                defaultValue={0}                
                onChange = {this.onChangeBL}
              />
            </Col>
            <Col span={1} />
            <Col span={2}>
              <Button type="primary" onClick = {this.connect}
                className="btn-margin-top submit-button maxWidth">Submit</Button>
            </Col>
          </Row>
          <div className="ebp-header-divider dashboard-rate-margin">
          </div>
          <h3 className="text-center">History</h3>
          <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{ 'textAlign': 'left' }}>
            <Row style={{ 'marginTop': '15px' }}>
              <Col span={24}>
                {this.historiesRender(true)}
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
  
  connect=()=>{
    const url = "http://localhost:8888/post"

    fetch(url,{
      method: "POST",
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: 'BlockNumber=123'
    }).catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))


  }
  
  ord_renderBreadcrumb () { // eslint-disable-line
    return (
      <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
        <Breadcrumb.Item><Link to="/home"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>History</Breadcrumb.Item>
      </Breadcrumb>
    )
  }
  
  onChangeBL(e) {
    this.setState({
        BlockNumber: e.target.value
    });
  }


  _handleKeyDown = evt => {
    if (evt.key === 'Enter') {
      this.setState({
        // valueInput: evt.target.value
      }, () => {
        // this.connect()
      })
    }
  }

  historiesRender(_orderType) {
    const columns = [
      {
        title: 'Block Number',
        dataIndex: 'action',
        key: 'action',
            render: (text, record) => (
              <span>
                {record.maker.substring(0, 5) === this.props.wallet.substring(0, 5) &&
                  <Button
                    onClick={() => this.props.cancel(_orderType, record.id)}
                    className="btn-margin-top submit-button maxWidth">
                      Cancel
                  </Button>
                }
              </span>
            )
      },
      {
        title: 'data',
        dataIndex: 'maker',
        key: 'maker'
      },
    ]
    return (<div>
      <Table rowKey="seq"
        dataSource={''}
        columns={columns} />
    </div>)
  }

}
