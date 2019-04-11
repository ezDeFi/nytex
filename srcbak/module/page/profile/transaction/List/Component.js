import React from 'react';
import BaseComponent from '@/model/BaseComponent'
import _ from 'lodash'
import I18N from '@/I18N'

import { Col, Row, Icon, Button, Carousel, Notification, Table, Card, Modal, InputNumber, Input, DatePicker } from 'antd'
import moment from 'moment/moment'
import './style.scss'
import {ETHERS_SCAN} from '@/constant'

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
                title: 'Transaction',
                dataIndex: '_id',
                width: '20%',
                render: (_id) => {
                    return _id
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
                title: 'Hash',
                dataIndex: 'hash',
                width: '20%',
                render: hash => {
                    if (!hash) {
                        return null
                    }
                    return <a href={`${ETHERS_SCAN}${hash}`} target="_blank">Hash</a>
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
