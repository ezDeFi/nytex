import React from 'react' // eslint-disable-line
import BaseComponent from '@/model/BaseComponent'
import { Col, Row, Icon } from 'antd' // eslint-disable-line
import { Link } from 'react-router-dom' // eslint-disable-line

import './style.scss'

export default class extends BaseComponent {
  ord_render () { // eslint-disable-line
    return (
      <div className="c_Footer">
        <div className="d_rowGrey">
          <Row className="d_rowFooter">
            <Col xs={24} sm={24} md={12} span={12}>
              <div className="d_footerSection">
                <b>NewSD: Stablecoin protocol</b>
                <p className="margin-left-5">
                  <a target="_blank" href="https://hackmd.io/FYPsDvdVRYWOLfRpypS4nw">Technical Paper</a>
                  <br></br>
                  <a target="_blank" href="https://medium.com/nextyplatform/newsd-exchange-guidelines-bbccab418bc8">Get Started!</a>
                </p>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} span={12}>
              <div className="d_footerSection">
                <b>FOLLOW US ON</b><br />
                <br />
                <p>
                  <a href="https://bitcointalk.org/index.php?topic=2498919"><Icon type="usergroup-add" style={{ fontSize: 22 }}/></a>&nbsp; &nbsp;
                  <a href="https://www.facebook.com/nextyio"><Icon type="facebook" style={{ fontSize: 22 }} /></a>&nbsp; &nbsp;
                  <a href="https://twitter.com/nextyio"><Icon type="twitter" style={{ fontSize: 22 }} /></a>
                </p>
                <b>Email</b>
                <p>
                  <a>support@nexty.io</a>
                </p>
              </div>
            </Col>
          </Row>
          <Row className="d_rowFooterBottom">
            <p className="text-center">2018 © Nexty Platform.</p>
          </Row>
        </div>
      </div>
    )
  }
}
