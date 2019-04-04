import React from 'react';
import StandardPage from '../StandardPage';
import _ from 'lodash'
import I18N from '@/I18N'

import './style.scss'

import { Col, Row, Icon, Button, Carousel, Notification, Table, Card, Modal, InputNumber, Input } from 'antd'
import moment from 'moment/moment'
import {TOKEN_ADDRESS, AMOUNT_DEFAULT} from '@/constant'

export default class extends StandardPage {

    state = {
    }

    async componentDidMount() {
        await super.componentDidMount()
        this.props.getLeaderBoard()
    }

    ord_renderContent() {
        return (
            <Row className="c_Home">
                <div className="ebp-header-divider" />
                <div className="p_admin_index">
                    <Row className="row_item">
                        <Col lg={6} md={6} sm={24} >
                        </Col>
                        <Col lg={12} md={12} sm={24} >
                            <Card bordered={false}>
                                <b>RANK POOL</b>
                                {this.props.rankPoolAmount && <h2 className="show_amount"><b>{this.props.rankPoolAmount.toFixed(3)} ETH</b></h2>}
                                <p>0.01 ETH = 10 Point, 1 refer = 50 Point, Please kindly note that referral is valid when the referred player tries at least 6 times (~0.06 ETH) (we are have 15 rewards)</p>
                            </Card>
                        </Col>
                        <Col lg={6} md={6} sm={24}>
                        </Col>
                    </Row>
                </div>
            </Row>
        );
    }
}
