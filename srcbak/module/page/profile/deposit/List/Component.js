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
                width: '20%',
                render: hash => {
                    return <a href={`${ETHERS_SCAN}${hash}`} target="_blank">Hash</a>
                }
            }, {
                title: 'Amount',
                dataIndex: 'value',
                width: '20%',
                render: value => {
                    return value
                },
                sorter: (a, b) => {
                    return a.value - b.value
                }
            }, {
                title: 'Round',
                dataIndex: 'countRound',
                width: '20%',
                render: countRound => {
                    return countRound
                },
                sorter: (a, b) => {
                    return a.countRound - b.countRound
                }
            }, {
                title: 'Jackpot',
                dataIndex: 'countJackpot',
                width: '20%',
                render: countJackpot => {
                    return countJackpot
                },
                sorter: (a, b) => {
                    return a.countJackpot - b.countJackpot
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
        const pagination = {defaultPageSize: 20}

        let total = 0
        data.forEach(item => {
            total += item.value
        })

        return (
            <div>
                <p>Total = {total} ETH  Count = {data.length}</p>
                <Table
                    className=""
                    dataSource={data}
                    loading={this.props.loading}
                    columns={columns}
                    bordered={true}
                    size="small"
                    pagination
                    rowKey="hash">
                </Table>
            </div>
        )
    }
}
