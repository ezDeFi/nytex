import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import './style.scss'

import { Col, Row, Icon, Button, Breadcrumb, Table, Input, Modal } from 'antd' // eslint-disable-line

export default class extends LoggedInPage {
  state = {

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
            <Col span={6}>
              Insert block number
            </Col>
            <Col span={8}>
              <Input className="maxWidth"
                placeholder="Block Number"
                defaultValue={0}
                value={this.state.mnty}
              />
            </Col>
            <Col span={1} />
            <Col span={4}>
              <Button type="primary" onClick={() => this.send()}
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

  ord_renderBreadcrumb () { // eslint-disable-line
    return (
      <Breadcrumb style={{ 'marginLeft': '16px', 'marginTop': '16px', float: 'right' }}>
        <Breadcrumb.Item><Link to="/home"><Icon type="home" /> Home</Link></Breadcrumb.Item>
        <Breadcrumb.Item>History</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

  onCopy = () => {
    this.setState({copied: true});
  };

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
