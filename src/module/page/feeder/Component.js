import React from 'react' // eslint-disable-line
import LoggedInPage from '../LoggedInPage'
import { Link } from 'react-router-dom' // eslint-disable-line
import db from '@/db'

import './style.scss'

import { Col, Row, Icon, Button, Breadcrumb, InputNumber, Slider } from 'antd' // eslint-disable-line

export default class extends LoggedInPage {
  state = {
    manual: 1.0,
  }

  async componentDidMount() {
    this.reload()
  }

  ord_renderContent () { // eslint-disable-line
    return (
      <div className="">
        <div className="ebp-header-divider">
        </div>

        <div className="ebp-page">
          <h3 className="text-center">Price Feed</h3>
          <div className="ant-col-md-18 ant-col-md-offset-3 text-alert" style={{ 'textAlign': 'left' }}>
            <Row>
              <Col span={18}>
                <Slider
                  value={this.state.manual}
                  onChange={this.manualChange}
                  step={0.001}
                  min={0.5}
                  max={1.5}
                  marks={{0.5: '0.5', 1.0:'1.0', 1.5:'1.5'}}
                />
              </Col>
              <Col span={1}/>
              <Col span={3}>
                <InputNumber
                  value={this.state.manual}
                  onChange={this.manualChange}
                  step={0.001}
                  min={0.5}
                  max={1.5}
                />
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
        <Breadcrumb.Item>price</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

  reload() {
    const page = this;
    db.get('feeder-manual', function(err, value) {
      if (err) {
        console.error(err);
        return;
      }
      if (!value) {
        value = 1.0;
      }
      page.setState({
        manual: Number(value)
      })
    });
  }

  manualChange = value => {
    if (isNaN(value)) {
      return;
    }
    this.setState({
      manual: value
    });
    db.put('feeder-manual', value);
  };
}
