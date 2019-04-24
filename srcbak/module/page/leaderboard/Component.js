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
                    <Row className="row_item d_box">
                        <Col lg={11} md={24} sm={24} >
                            {this.renderLeaderboardMonthly()}
                        </Col>
                        <Col lg={2} md={24} sm={24} >
                        </Col>
                        <Col lg={11} md={24} sm={24}>
                            {this.renderLeaderboardWeekly()}
                        </Col>
                    </Row>
                </div>
            </Row>
        );
    }

    renderLeaderboardMonthly() {
        const columns = [
            {
                title: 'Rank',
                dataIndex: 'no',
                width: '10%',
                render: no => {
                    return no
                }
            },
            {
                title: 'Username',
                dataIndex: 'username',
                width: '30%',
                render: username => {
                    return username
                }
            }, {
                title: 'Point',
                dataIndex: 'point',
                width: '25%',
                render: point => {
                    return Number(point).toFixed(0)
                }
            }, {
                title: 'Reward',
                dataIndex: 'reward',
                width: '35%',
                render: (reward, record) => {
                    return <span>{reward.toFixed(5)} ETH ({record.percent}%)</span>
                }
            }
        ]

        return (
            <div className="">
                <div className="">
                    <p className="with-gizmo">
                        <h3>Leaderboard Monthly</h3>
                        {this.props.dateMonthly && <span>({moment(this.props.dateMonthly.startDate).format('DD-MM-YYYY')} -> {moment(this.props.dateMonthly.endDate).format('DD-MM-YYYY')})</span>}
                    </p>
                    <Table
                        className="no-borders"
                        dataSource={this.props.rankMonthly}
                        loading={this.props.loading}
                        columns={columns}
                        bordered={false}
                        size="small"
                        pagination={false}
                        rowKey="username">
                    </Table>
                </div>
            </div>
        )
    }

    renderLeaderboardWeekly() {
        const columns = [
            {
                title: 'Rank',
                dataIndex: 'no',
                width: '20%',
                render: no => {
                    return no
                }
            },
            {
                title: 'Username',
                dataIndex: 'username',
                width: '60%',
                render: username => {
                    return username
                }
            }, {
                title: 'Point',
                dataIndex: 'point',
                width: '20%',
                render: point => {
                    return Number(point).toFixed(0)
                }
            }
        ]

        return (
            <div className="">
                <div className="">
                    <p className="with-gizmo">
                        <h3>Leaderboard Weekly</h3>
                        {this.props.dateWeekly && <span>({moment(this.props.dateWeekly.startDate).format('DD-MM-YYYY')} -> {moment(this.props.dateWeekly.endDate).format('DD-MM-YYYY')})</span>}
                    </p>
                    <Table
                        className="no-borders"
                        dataSource={this.props.rankWeekly}
                        loading={this.props.loading}
                        columns={columns}
                        bordered={false}
                        pagination={false}
                        size="small"
                        rowKey="username">
                    </Table>
                </div>
            </div>
        )
    }
}
