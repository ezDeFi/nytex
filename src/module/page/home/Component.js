import React from 'react';
import StandardPage from '../StandardPage';
import _ from 'lodash'
import I18N from '@/I18N'
import {MAX_WIDTH_MOBILE, MIN_WIDTH_PC} from '@/config/constant'
import {isMobile} from "../../../util"
import URI from 'urijs'

import './style.scss'

import { Col, Row, Icon, Button, Carousel, Notification, Table, Card, Modal, InputNumber, Input, Divider, Message, Alert } from 'antd'
import moment from 'moment/moment'
import {TOKEN_ADDRESS, AMOUNT_DEFAULT, ETHERS_SCAN} from '@/constant'

export default class extends StandardPage {

    state = {
    }

    async componentDidMount() {
        const params = new URI(this.props.location.search || '').search(true)
        if (params && params.ref) {
            localStorage.setItem('ref', params.ref)
        }
    }

    gotoGame(game) {
        this.props.history.push(game)
    }

    ord_renderContent() {

        return (
            <Row className="c_Home">
                <div className="container">
                    <Row className="games">
                        <Col className="item">
                            <Card
                                onClick={this.gotoGame.bind(this, 'dapps/simpledice')}
                                hoverable
                                cover={<img src="/assets/images/coinflip.png" />}
                            >
                                <span className="name">Coin Flip</span>
                            </Card>
                        </Col>
                        <Col className="item">
                            <Card
                                hoverable
                                cover={<img src="/assets/images/dice.png" />}
                            >
                                <span className="name">Dice (Comming soon)</span>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Row>
        );
    }
}
