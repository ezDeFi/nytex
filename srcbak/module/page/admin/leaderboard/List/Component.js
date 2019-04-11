import React from 'react';
import BaseComponent from '@/model/BaseComponent'
import _ from 'lodash'
import I18N from '@/I18N'

import { Col, Row, Icon, Button, Carousel, Notification, Table, Card, Modal, InputNumber, Input, DatePicker } from 'antd'
import moment from 'moment/moment'
import './style.scss'

const { RangePicker } = DatePicker

export default class extends BaseComponent {

    ord_render () {
        return (
            <div>
                <Row>
                    <RangePicker onChange={this.props.onChangeDatePicker.bind(this)} />
                </Row>
                <br />
                <Row className="c_Home">
                    {this.renderList()}
                </Row>
            </div>
        );
    }

    linkProfileInfo(userId) {
        this.props.history.push(`/admin/profile/${userId}`)
    }

    renderList() {
        const columns = [
            {
                title: 'Rank',
                dataIndex: 'no',
                width: '10%',
                render: no => {
                    return no
                },
                sorter: (a, b) => {
                    return a.no - b.no
                }
            },
            {
                title: 'User',
                dataIndex: 'user',
                width: '45%',
                render: user => {
                    return <a onClick={this.linkProfileInfo.bind(this, user._id)}>{user.username}</a>
                },
                sorter: (a, b) => {
                    if (a.username && b.username) {
                        return a.username.localeCompare(b.username)
                    }
                }
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                width: '15%',
                render: amount => {
                    return amount.toFixed(2)
                },
                sorter: (a, b) => {
                    return a.amount - b.amount
                }
            }, {
                title: 'Refer',
                dataIndex: 'refer',
                width: '15%',
                render: refer => {
                    return refer
                },
                sorter: (a, b) => {
                    return a.refer - b.refer
                }
            }, {
                title: 'Point',
                dataIndex: 'point',
                width: '15%',
                render: point => {
                    return point.toFixed(2)
                },
                sorter: (a, b) => {
                    return a.point - b.point
                }
            }
        ]

        const data = this.props.list

        return (
            <div>
                <p>Count = {data.length}</p>
                <Table
                    className=""
                    dataSource={data}
                    loading={this.props.loading}
                    columns={columns}
                    bordered={true}
                    size="small"
                    rowKey="hash">
                </Table>
            </div>
        )
    }
}
