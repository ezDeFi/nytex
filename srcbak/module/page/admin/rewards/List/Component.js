import React from 'react';
import BaseComponent from '@/model/BaseComponent'
import _ from 'lodash'
import I18N from '@/I18N'
import {ETHERS_SCAN} from '@/constant'

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
                    {this.renderDepositList()}
                </Row>
            </div>
        );
    }

    linkProfileInfo(userId) {
        this.props.history.push(`/admin/profile/${userId}`)
    }

    renderDepositList() {
        const columns = [
            {
                title: 'Hash',
                dataIndex: 'hash',
                width: '10%',
                render: hash => {
                    if (!hash) {
                        return null
                    }
                    return <a href={`${ETHERS_SCAN}${hash}`} target="_blank">Hash</a>
                }
            },
            {
                title: 'User',
                dataIndex: 'userId',
                width: '20%',
                render: (userId, record) => {
                    if (!userId) {
                        return record.walletAddress
                    }

                    return <a onClick={this.linkProfileInfo.bind(this, record.userId._id)}>{userId && userId.username}</a>
                },
                sorter: (a, b) => {
                    if (a.userId && b.userId) {
                        return a.userId.username.localeCompare(b.userId.username)
                    }
                }
            },
            {
                title: 'Type',
                dataIndex: 'type',
                width: '10%',
                render: type => {
                    return type
                }
            },
            {
                title: 'Reason',
                dataIndex: 'reason',
                width: '25%',
                render: reason => {
                    return reason
                }
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                width: '5%',
                render: amount => {
                    return amount
                },
                sorter: (a, b) => {
                    return a.amount - b.amount
                }
            },
            {
                title: 'Round',
                dataIndex: 'countRound',
                width: '5%',
                render: countRound => {
                    return countRound
                },
                sorter: (a, b) => {
                    return a.countRound - b.countRound
                }
            },
            {
                title: 'Jackpot',
                dataIndex: 'countJackpot',
                width: '5%',
                render: countJackpot => {
                    return countJackpot
                },
                sorter: (a, b) => {
                    return a.countJackpot - b.countJackpot
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

        let total = 0
        data.forEach(item => {
            total += Number(item.amount)
        })

        return (
            <div>
                <p>Total = {total} ETH Count = {data.length}</p>
                <Table
                    className=""
                    dataSource={data}
                    loading={this.props.loading}
                    columns={columns}
                    bordered={true}
                    size="small"
                    rowKey="_id">
                </Table>
            </div>
        )
    }
}
