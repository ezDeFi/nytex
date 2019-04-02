import React from 'react';
import StandardPage from '../StandardPage';
import _ from 'lodash'
import I18N from '@/I18N'
import {MAX_WIDTH_MOBILE, MIN_WIDTH_PC} from '@/config/constant'
import {isMobile} from "../../../util"

import './style.scss'

import { Form, Col, Row, Icon, Button, Carousel, Notification, Table, Card, Modal, InputNumber, Input, Divider, Message, Alert } from 'antd'
import {weiToEthS} from './help'

export default class extends StandardPage {

    state = {
    }

    async componentDidMount() {
        await super.componentDidMount()
    }

    loadUserData() {
        this.props.isCitizen()
        this.props.getWalletBalance()
        this.props.getBalance()
        this.props.getMyRefAddress()
        this.props.getMyRefUsername()
    }

    ord_renderContent() {
        //if (this.props.wallet !== '') {
            this.loadUserData()
        //}
        return (
            <Row className="c_Home">
                <div className="container">
                    <Row className="games test">
                        {!this.props.isCitizen && this.registerRender()}
                        {this.props.isCitizen && this.userDataRender()}
                        {this.depositRender()}
                        {this.withdrawRender()}
                    </Row>
                </div>
            </Row>
        );
    }

    rusernameChange(e) {
        this.setState({
            rusername: e.target.value
        })
    }

    rRefAddressChange(e) {
        this.setState({
            rRefAddress: e.target.value
        })
    }

    emailChange(e) {
        this.setState({
            email: e.target.value
        })
    }

    depositAmountChange(e) {
        this.setState({
            depositAmount: Number(e.target.value) * 1e18
        })
    }

    withdrawAmountChange(e) {
        this.setState({
            withdrawAmount: Number(e.target.value) * 1e18
        })
    }

    register() {
        this.props.usernameExist(this.state.rusername).then((exist) => {
            if (exist) {
                console.log('Username already exist!')
                return
            }
            // console.log('register username =', this.state.rusername)
            // console.log('register email =', this.state.email)
            var rRefAddress = '0xa6A482918C7C9d6Ec21Df18A8c8F5C6FE60B5A44'
            this.props.register(this.state.rusername, rRefAddress)
        })
    }

    deposit() {
        this.props.deposit(this.state.depositAmount).then(() => {
            console.log('deposit tx sent')
        })
    }

    withdraw() {
        this.props.withdraw(this.state.withdrawAmount).then(() => {
            console.log('withdraw tx sent')
        })
    }

    withdrawAll() {
        this.props.withdraw(this.state.myBalance).then(() => {
            console.log('withdrawAll tx sent')
        })
    }

    registerRender() {
        return (
            <Form layout="inline">
                <Form.Item>
                    <Input onChange = {this.rusernameChange.bind(this)} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                </Form.Item>
                <Form.Item>
                    <Input onChange = {this.rRefAddressChange.bind(this)} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Ref Address" />
                </Form.Item>
                <Form.Item>
                    <Input onChange = {this.emailChange.bind(this)} prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} type="email" placeholder="Email" />
                </Form.Item>
                <Button onClick = {() => this.register()} type="primary">
                    Register
                </Button>
            </Form>
        )
    }

    depositRender() {
        return (
            <Form layout="inline">
                <Form.Item>
                    <Input type = "number" onChange = {this.depositAmountChange.bind(this)} prefix={<Icon type="wallet" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Amount (ETH)" />
                </Form.Item>
                <Button onClick = {() => this.deposit()} type="primary">
                    Deposit
                </Button>
            </Form>
        )
    }

    withdrawRender() {
        return (
            <Form layout="inline">
                <Form.Item>
                    <Input type = "number" onChange = {this.withdrawAmountChange.bind(this)} prefix={<Icon type="wallet" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Amount (ETH)" />
                </Form.Item>
                <Button onClick = {() => this.withdraw()} type="primary">
                    Withdraw
                </Button>
                <p></p>
                <Button onClick = {() => this.withdrawAll()} type="primary">
                    Withdraw All
                </Button>
            </Form>
        )
    }

    userDataRender() {
        return (<div>
            <p>username = {this.props.username}</p>
            <p>Wallet = {this.props.wallet} </p>
            <p>Wallet balance = {weiToEthS(this.props.walletBalance)} ETH</p>
            <p>Your balance = {weiToEthS(this.props.balance)} ETH</p>
            <p>Your Ref Address = {this.props.refAddress}</p>
            <p>Your Ref Username = {this.props.refUsername}</p>
        </div>)
    }
}
