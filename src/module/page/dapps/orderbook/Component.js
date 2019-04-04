import React from 'react';
import StandardPage from '../../StandardPage';
import _ from 'lodash'
import AnimatedNumber from "animated-number-react";
import I18N from '@/I18N'
import {MAX_WIDTH_MOBILE, MIN_WIDTH_PC} from '@/config/constant'
import MediaQuery from 'react-responsive'
/* import {isMobile} from "../../../util" */

import './style.scss'

import { Form, Col, Row, Icon, Button, Carousel, Notification, Table, Card, Modal, InputNumber, Input, Divider, Message, Alert, Progress } from 'antd'
import {weiToEthS, mmss, charFormatNoSpace, cutString} from './help'
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default class extends StandardPage {

    state = {
        data: [],
        copied: false,
        amount: 0,
        price: 0
    }

    async componentDidMount() {
        this.reload()
    }

    ord_renderContent() {
        return (
            <Row className="c_Home">
                <MediaQuery minWidth={MIN_WIDTH_PC}>
                    <div className="game-container white-text">
                        <p>Wallet = {this.props.wallet}</p>
                        VolatileToken Balances : {this.props.volatileTokenBalance} VolatileToken {this.props.stableTokenBalance} StableToken
                        <p>TRANSFER</p>
                        <Input size="medium"
                            onChange={this.toWalletChange.bind(this)}
                            value={this.state.toWallet}
                            defaultValue={'0x'}
                        />
                        <InputNumber size="large"
                            onChange={this.transferAmountChange.bind(this)}
                            value={this.state.transferAmount}
                            defaultValue={0}
                        />
                            <Button size="large" onClick={() => this.transferVolatileToken()} className="item">transfer VolatileToken</Button>
                            <Button size="large" onClick={() => this.transferStableToken()} className="item">transfer</Button>
                        <p></p>
                        amount
                        <InputNumber size="large"
                            onChange={this.amountChange.bind(this)}
                            value={this.state.amount}
                            defaultValue={0}
                        />
                        price
                        <InputNumber size="large"
                            onChange={this.priceChange.bind(this)}
                            value={this.state.price}
                            defaultValue={0}
                        />
                        <p></p>
                        <Button size="large" onClick={() => this.sellVolatileToken()} className="item">Sell</Button>
                        <Button size="large" onClick={() => this.buyVolatileToken()} className="item">Buy</Button>
                        <Input size="large"
                            onChange={this.idChange.bind(this)}
                            value={this.state.id}
                            defaultValue={'0x'}
                        />
                        <Button size="large" onClick={() => this.remove(false)} className="item">sell remove</Button>
                        <Button size="large" onClick={() => this.remove(true)} className="item">buy remove</Button>
                    </div>
                    {this.ordersRender()}
                    <Button size="large" onClick={() => this.reload()} className="item">Reload</Button>
                </MediaQuery>
            </Row>
        );
    }

    remove(_orderType) {
        return this.props.remove(_orderType, this.state.id)
    }

    async reload() {
        this.setState({data: []})
        await this.props.reload()
        let falseLength = this.props.orders.false.length
        let trueLength = this.props.orders.true.length
        let l = falseLength > trueLength ? falseLength : trueLength
        console.log('length = ', l)
        let data = []
        for (let i = 0; i < l; i++) {
            let falseOrder = i< falseLength ? this.props.orders.false[i] : ''
            let trueOrder = i < trueLength ? this.props.orders.true[i] : ''
            data.push({
                idWnty: falseOrder.id,
                addressWnty: cutString(falseOrder.maker),
                amountWnty: falseOrder.fromAmount,
                priceWnty: falseOrder.fromAmount ? falseOrder.toAmount / falseOrder.fromAmount : '',
                idNusd: trueOrder.id,
                addressNusd: cutString(trueOrder.maker),
                amountNusd: trueOrder.toAmount,
                priceNusd: trueOrder.fromAmount ? trueOrder.fromAmount / trueOrder.toAmount : ''
            })
        }
        this.setState({data: data})
    }

    onCopy = () => {
        this.setState({copied: true});
      };

    ordersRender() {

        //const data = [{'fromAmountWnty' : 0, 'toAmountWnty' : 1, 'fromAmountNusd' : 2, 'toAmountNusd' : 3}];
        const columns = [
            {
                title: 'Sell',
                children: [
                    {
                        title: 'id',
                        dataIndex: 'idWnty',
                        key: 'idWnty',
                        render: (text, record) => (
                            <span>
                                {record.idWnty &&
                                <CopyToClipboard onCopy={this.onCopy} text={record.idWnty}>
                                    <button>Copy</button>
                                </CopyToClipboard>
                                }
                            </span>
                        )
                    },
                    {
                        title: 'address',
                        dataIndex: 'addressWnty',
                        key: 'addressWnty'
                    },
                    {
                        title: 'amount',
                        dataIndex: 'amountWnty',
                        key: 'amountWnty'
                    },
                    {
                        title: 'price',
                        dataIndex: 'priceWnty',
                        key: 'priceWnty'
                    },
                ]
            },
            {
                title: 'Buy',
                children: [
                    {
                        title: 'id',
                        dataIndex: 'idNusd',
                        key: 'idNusd',
                        render: (text, record) => (
                            <span>
                                {record.idNusd &&
                                <CopyToClipboard onCopy={this.onCopy} text={record.idNusd}>
                                    <button>Copy</button>
                                </CopyToClipboard>
                                }
                            </span>
                        )
                    },
                    {
                        title: 'address',
                        dataIndex: 'addressNusd',
                        key: 'addressNusd'
                    },
                    {
                        title: 'amount',
                        dataIndex: 'amountNusd',
                        key: 'amountNusd'
                    },
                    {
                        title: 'price',
                        dataIndex: 'priceNusd',
                        key: 'priceNusd'
                    },
                ]
            }
        ]
        return (<div>
            <Table rowKey="id" dataSource={this.state.data} columns={columns} pagination={false} />
        </div>)
    }

    transferVolatileToken() {
        this.props.transferVolatileToken(this.state.toWallet, this.state.transferAmount)
    }

    transferStableToken() {
        this.props.transferStableToken(this.state.toWallet, this.state.transferAmount)
    }

    sellVolatileToken() {
        let fromAmount = this.state.amount
        let toAmount = Math.floor(fromAmount * this.state.price)
        this.props.sellVolatileToken(fromAmount, toAmount)
    }

    buyVolatileToken() {
        let toAmount = this.state.amount
        let fromAmount = Math.floor(toAmount * this.state.price)
        this.props.sellStableToken(fromAmount, toAmount)
    }

    idChange(e) {
        this.setState({
            id: e.target.value
        })
    }

    toWalletChange(e) {
        this.setState({
            toWallet: e.target.value
        })
    }

    transferAmountChange(amount) {
        this.setState({
            transferAmount: amount
        })
    }

    amountChange(amount) {
        this.setState({
            amount: amount
        })
    }

    priceChange(price) {
        this.setState({
            price: price
        })
    }
}
