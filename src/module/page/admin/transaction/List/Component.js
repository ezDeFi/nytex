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

    linkTransactionDetails(transactionId) {
        this.props.history.push(`/admin/transaction/${transactionId}`)
    }

    renderList() {
        const columns = [
            {
                title: 'Transaction',
                dataIndex: '_id',
                width: '20%',
                render: (_id) => {
                    return <a onClick={this.linkTransactionDetails.bind(this, _id)}>Details</a>
                }
            },
            {
                title: 'User',
                dataIndex: 'userId',
                width: '20%',
                render: (userId) => {
                    if (!userId) {
                        return null
                    }

                    return <a onClick={this.linkProfileInfo.bind(this, userId._id)}>{userId && userId.username}</a>
                },
                sorter: (a, b) => {
                    if (a.userId && b.userId) {
                        return a.userId.username.localeCompare(b.userId.username)
                    }
                }
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                width: '20%',
                render: amount => {
                    return amount
                },
                sorter: (a, b) => {
                    return a.amount - b.amount
                }
            },
            {
                title: 'Date',
                dataIndex: 'createdAt',
                width: '20%',
                render: createdAt => {
                    return moment(createdAt).format('DD-MM-YYYY: HH:mm')
                },
                sorter: (a, b) => {
                    return a.createdAt.localeCompare(b.createdAt)
                }
            },
            {
                title: 'Status',
                dataIndex: 'status',
                width: '20%',
                render: status => {
                    return status
                },
                sorter: (a, b) => {
                    return a.status.localeCompare(b.status)
                },
                filters: [{
                    text: 'APPROVED',
                    value: 'APPROVED'
                  }, {
                    text: 'PENDING',
                    value: 'PENDING'
                }, {
                    text: 'REJECTED',
                    value: 'REJECTED'
                }],
                onFilter: (value, record) => {
                    if (record.status) {
                        return record.status.indexOf(value) === 0
                    }
                },
            }
        ]

        const data = this.props.list

        let count = 0
        data.forEach(item => {
            if (item.status === 'PENDING') {
                count += 1
            }
        })

        return (
            <div>
                <p>Count = {data.length} PENDING = {count}</p>
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
