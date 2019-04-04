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
                title: 'Invite By',
                dataIndex: 'inviteBy',
                width: '20%',
                render: inviteBy => {
                    if (!inviteBy) {
                        return null
                    }

                    return <a onClick={this.linkProfileInfo.bind(this, inviteBy._id)}>{inviteBy && inviteBy.username}</a>
                },
                sorter: (a, b) => {
                    if (a.inviteBy && b.inviteBy) {
                        return a.inviteBy.username.localeCompare(b.inviteBy.username)
                    }
                }
            }, {
                title: 'Status',
                dataIndex: 'status',
                width: '20%',
                render: status => {
                    return status
                },
                sorter: (a, b) => {
                    return a.status.localeCompare(b.status)
                }
            }, {
                title: 'Approve Date',
                dataIndex: 'approveDate',
                width: '20%',
                render: approveDate => {
                    return moment(approveDate).format('DD-MM-YYYY: HH:mm')
                },
                sorter: (a, b) => {
                    return a.approveDate.localeCompare(b.approveDate)
                }
            }, {
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
