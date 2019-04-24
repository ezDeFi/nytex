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

export default class extends StandardPage {

    state = {
        betAmountHeads: 0.1,
        betAmountTails: 0.1,
        duration: 1600,
        showFinalizeModal: false,
        isBetTails: false,
        isBetHeads: false,
        alreadyShowFinalizeModal: false,
        percent: 0
    }

    async componentDidMount() {
    }

    ord_renderContent() {
        return (
            <Row className="c_Home">
                <MediaQuery minWidth={MIN_WIDTH_PC}>
                    <div className="game-container">
                        <div className="count-round">Rounds #{this.props.curRoundId}</div>
                        <div className="bet-countdown">
                            {this.renderTailsBet()}
                            {this.renderCountdown()}
                            {this.renderHeadsBet()}
                        </div>
                        <div className="">
                            {this.renderAutoAmount()}
                        </div>
                    </div>
                </MediaQuery>
                <MediaQuery maxWidth={MAX_WIDTH_MOBILE}>
                    <div className="game-container">
                        <div className="count-round">Rounds #{this.props.curRoundId}</div>
                        <div className="">
                            {this.renderCountdown()}
                        </div>
                        <div className="bet-countdown">
                            <div className="wrap-bet">
                                {this.renderTailsBet()}
                                {this.renderHeadsBet()}
                            </div>
                        </div>
                        <div className="">
                            {this.renderAutoAmount()}
                        </div>
                    </div>
                </MediaQuery>
                <div className="container">
                    {this.renderFinalizeModal()}
                    <Row className="games test">
                        {/*{!this.props.isCitizen && this.registerRender()}*/}
                        {/*{this.userDataRender()}*/}
                        {/*{this.betRender()}*/}
                        {this.teamsRender()}
                    </Row>
                </div>
            </Row>
        );
    }

    showFinalizeModal() {
        this.setState({showFinalizeModal: true})
    }

    hiddenFinalizeModal() {
        this.setState({showFinalizeModal: false})
    }

    playagain() {
        this.setState({alreadyShowFinalizeModal: true})
        this.props.playagain()
        this.hiddenFinalizeModal()
    }

    renderFinalizeModal() {
        let isWin = false
        if (this.props.winTeam && this.state.isBetTails) {
            isWin = true
        }

        if (!this.props.winTeam && this.state.isBetHeads) {
            isWin = true
        }

        return (
            <Modal
                maskClosable={false}
                closable={false}
                className="finalizedgame"
                visible={this.state.showFinalizeModal}
                onOk={this.showFinalizeModal.bind(this)}
                onCancel={this.hiddenFinalizeModal.bind(this)}
                footer={null}
                centered={true}
                width="60%"
            >
                <div className={`finalized-content ${isWin ? 'youwin' : 'youlose'}`}>
                    <h1>{isWin ? 'You Win' : 'You Lose'}</h1>
                    <Button className="playagain" onClick={this.playagain.bind(this)}>Play Again</Button>
                </div>
            </Modal>
        )
    }

    setBetAmount(amount) {
        this.setState({
            betAmountTails: amount,
            betAmountHeads: amount
        })
    }

    onChaneAmountTails(amount) {
        this.setState({
            betAmountTails: amount
        })
    }

    onChaneAmountHeads(amount) {
        this.setState({
            betAmountHeads: amount
        })
    }

    renderAutoAmount() {
        return (
            <div className="auto-amount">
                <Button size="large" onClick={this.setBetAmount.bind(this, 0.1)} className="item">0.10</Button>
                <Button size="large" onClick={this.setBetAmount.bind(this, 0.15)} className="item">0.15</Button>
                <Button size="large" onClick={this.setBetAmount.bind(this, 0.2)} className="item">0.20</Button>
                <Button size="large" onClick={this.setBetAmount.bind(this, 0.3)} className="item">0.30</Button>
                <Button size="large" onClick={this.setBetAmount.bind(this, 0.5)} className="item">0.50</Button>
            </div>
        )
    }

    formatValue(value) {
        return `${Number(value).toFixed(2)}`
    }

    renderSpinCountdown() {
        const dateTime = new Date().getTime()
        const timestamp = Math.floor(dateTime / 1000)
        const distance = this.props.endTime - timestamp

        const flip = (<div className="spin-times"><img src="/assets/images/flip.svg" /></div>)
        const percent = ((distance / 60) / 5) * 100

        if (!this.props.locked && this.props.started) {
            if (mmss(this.props.endTime) === '00:00') {
                return flip
            } else {
                return (<div className="countdown-times">
                        <Progress strokeColor="red" showInfo={false} type="circle" percent={percent} />
                        <div className="times">{mmss(this.props.endTime)}</div>
                    </div>)
            }
        } else if (!this.props.started) {
            return (<div className="countdown-times">
                        <Progress strokeColor="red" showInfo={false} type="circle" percent={this.state.percent} />
                        <div className="times">00:00</div>
                    </div>)
        } else if (this.props.started && this.props.locked && !this.props.finalized) {
            return flip
        }
    }

    renderCountdown() {
        return (
            <div className="countdown">
                <div className="game-name">
                    <img src="/assets/images/coinflip-name.png" />
                </div>
                <div className="content-countdown">
                    {this.props.locked && this.props.finalized && this.props.winTeam && <div className="spin-times"><img src="/assets/images/tails.png" /></div>}
                    {this.props.locked && this.props.finalized && !this.props.winTeam && <div className="spin-times"><img src="/assets/images/heads.png" /></div>}
                    {this.renderSpinCountdown()}
                </div>
            </div>
        )
    }

    renderTailsBet() {
        return (
            <div className="tails">
                <div className="image"><img src="/assets/images/tails.png" /></div>
                <div className="player"><img src="/assets/images/player-tails.png" /> {this.props.playersTails} Players</div>
                <div className="amount">
                    {this.animateNumber(weiToEthS(this.props.betSum.true))} ETH
                </div>
                <div className="input-bet">
                    <InputNumber size="large"
                        onChange={this.onChaneAmountTails.bind(this)}
                        value={this.state.betAmountTails}
                        defaultValue={this.state.betAmountTails} />
                </div>
                <div className="bet">
                    <Button onClick={this.betGame.bind(this, true, this.state.betAmountTails)} className="bet-btn">Place Bet</Button>
                </div>
            </div>
        )
    }

    renderHeadsBet() {
        return (
            <div className="heads">
                <div className="image"><img src="/assets/images/heads.png" /></div>
                <div className="player"><img src="/assets/images/player-heads.png" /> {this.props.playersHeads} Players</div>
                <div className="amount">
                    {this.animateNumber(weiToEthS(this.props.betSum.false))} ETH
                </div>
                <div className="input-bet">
                    <InputNumber size="large"
                        onChange={this.onChaneAmountHeads.bind(this)}
                        value={this.state.betAmountHeads}
                        defaultValue={this.state.betAmountHeads} />
                </div>
                <div className="bet">
                    <Button onClick={this.betGame.bind(this, false, this.state.betAmountHeads)} className="bet-btn">Place Bet</Button>
                </div>
            </div>
        )
    }

    betGame(team, amount) {
        if (!this.props.wallet) {
            return this.props.toggleRegisterModal(true)
        }
        this.setState({alreadyShowFinalizeModal: false})
        this.props.bet(team, Number(amount) * 1e18).then(() => {
            console.log('deposit tx sent')
            // Message.success('Bet success!')
        })
    }

    rusernameChange(e) {
        this.setState({
            rusername: e.target.value
        })
    }

    rRefChange(e) {
        this.setState({
            rRef: e.target.value
        })
    }

    emailChange(e) {
        this.setState({
            email: e.target.value
        })
    }

    betAmountChange(e) {
        this.setState({
            betAmount: Number(e.target.value) * 1e18
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

    bet(_team) {
        this.props.bet(_team, this.state.betAmount).then(() => {
            console.log('deposit tx sent')
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

    // TEST FUNCTION

    forcedEndRound() {
        this.props.forcedEndRound().then(() => {
            console.log('forcedEndRound tx sent')
        })
    }

    registerRender() {
        return (
            <Form layout="inline">
                <Form.Item>
                    <Input onChange = {this.rusernameChange.bind(this)} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                </Form.Item>
                <Form.Item>
                    <Input onChange = {this.rRefChange.bind(this)} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Ref Address / Username" />
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

    betRender() {
        return (
            <div>
                <Form layout="inline">
                    <p>BET AREA</p>
                    <Form.Item>
                        <Input type = "number" onChange = {this.betAmountChange.bind(this)} prefix={<Icon type="wallet" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Amount (ETH)" />
                    </Form.Item>
                    <Button onClick = {() => this.bet(true)} type="primary">
                        true
                    </Button>
                    <Button onClick = {() => this.bet(false)} type="primary">
                        false
                    </Button>
                </Form>
                <Form layout="inline">
                    <Button onClick = {() => this.forcedEndRound()} type="primary">
                        ForcedEndRound(TEST)
                    </Button>
                </Form>
            </div>
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

    animateNumber(value) {
        return (
            <AnimatedNumber
                value={value}
                formatValue={this.formatValue}
                duration={this.state.duration}
            />
        )
    }

    userDataRender() {
        return (<div>
            {this.props.isCitizen ? <p>username = {charFormatNoSpace(this.props.username)}</p> : <p>Not registered</p>}
            <p>Wallet = {this.props.wallet} </p>
            <p>Wallet balance = {weiToEthS(this.props.walletBalance)} ETH</p>
            <p>Your balance = {weiToEthS(this.props.balance)} ETH</p>
        </div>)
    }

    renderTitleTails() {
        return (
            <div>
                <img width="30" src="/assets/images/tails.png" />&nbsp;
                {this.animateNumber(this.props.betSum.true / 1e18)} ETH ({this.props.playersTails} Players)
            </div>
        )
    }

    renderTitleHeads() {
        return (
            <div>
                <img width="30" src="/assets/images/heads.png" />&nbsp;
                {this.animateNumber(this.props.betSum.false / 1e18)} ETH ({this.props.playersHeads} Players)
            </div>
        )
    }

    toLocaleLowerCase(string) {
        if (!string) {
            return
        }

        return string.toLocaleLowerCase()
    }

    teamsRender() {
        const data = [];
        const betLength = this.props.betLength
        const bets = this.props.bets
        const maxId = betLength.true > betLength.false ? betLength.true : betLength.false

        for (let i = 0; i < maxId; i++) {
            let trueBet = bets.true[i] ? bets.true[i] : ['', '']
            let falseBet = bets.false[i] ? bets.false[i] : ['', '']
            if (this.toLocaleLowerCase(this.props.wallet) === this.toLocaleLowerCase(trueBet[0]) && !this.state.isBetTails) {
                this.setState({isBetTails: true})
            }

            if (this.toLocaleLowerCase(this.props.wallet) === this.toLocaleLowerCase(falseBet[0]) && !this.state.isBetHeads) {
                this.setState({isBetHeads: true})
            }

            data.push({
                'id': i + 1,
                'truePlayer': charFormatNoSpace(trueBet[0]),
                'trueAmount': trueBet[1] ? weiToEthS(trueBet[1]) + ' ETH' : trueBet[1],
                'falsePlayer': charFormatNoSpace(falseBet[0]),
                'falseAmount': falseBet[1] ? weiToEthS(falseBet[1]) + ' ETH' : falseBet[1]
            })
        }
        const columns = [
            {
                title: this.renderTitleTails(),
                children: [
                    {
                        title: 'Player',
                        dataIndex: 'truePlayer',
                        key: 'truePlayer'
                    },
                    {
                        title: 'Amount',
                        dataIndex: 'trueAmount',
                        key: 'trueAmount'
                    }
                ]
            },
            {
                title: this.renderTitleHeads(),
                children: [
                    {
                        title: 'Player',
                        dataIndex: 'falsePlayer',
                        key: 'falsePlayer'
                    },
                    {
                        title: 'Amount',
                        dataIndex: 'falseAmount',
                        key: 'falseAmount'
                    }
                ]
            }
        ];

        if (this.props.locked && this.props.finalized && !this.state.showFinalizeModal && !this.state.alreadyShowFinalizeModal) {
            this.setState({showFinalizeModal: true})
        }

        return (<div>
            {/*{this.props.started && <p>KeyBlock = {this.props.keyBlock} restTime = {!this.props.locked ? mmss(this.props.endTime) : '00:00'} </p>}
            <p>States : {!this.props.started ? 'Timer not started' : (!this.props.locked ? 'Timer is running' : (!this.props.finalized ? 'drawing results' : 'Ended'))}</p>
            {this.props.locked && this.props.finalized && <h1 style={{'color': 'white'}}> WINNERS = {this.props.winTeam ? 'TRUE' : 'FALSE'} </h1>}*/}
            <Table rowKey="id" dataSource={data} columns={columns} pagination={false} />
        </div>)
    }
}
