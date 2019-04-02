import React from 'react'
import BaseComponent from '@/model/BaseComponent'

import {Row, Col, Icon, Menu} from 'antd';

import './style'
import { Modal } from 'antd/lib/index'
import _ from 'lodash'
import I18N from '@/I18N'

import {USER_ROLE, USER_LANGUAGE} from '@/constant'

export default class extends BaseComponent {

    handleMenuClick(ev,) {

        const key = ev.key
        if (_.includes([
            'login',
            'signup',
            'profile/info',
            'admin/users',
            'help',
            'about',
            'faq',
            'contact',
            'slack',
            'leaderboard',
            'bank',
            'dapps/simpledice'
        ], key)) {
            this.props.history.push('/' + ev.key)
        }
        else if (key === 'register') {
            this.props.toggleRegisterModal(true)
            this.props.toggleMobileMenu()
        }
        else if (key === 'logout') {
            Modal.confirm({
                title: I18N.get('logout.title'),
                content: '',
                okText: I18N.get('.yes'),
                okType: 'danger',
                cancelText: I18N.get('.no'),
                onOk: () => {
                    this.props.logout()
                },
                onCancel() {
                }
            })
        }
    }

    ord_render () {

        const isLogin = this.props.user.is_login
        const hasAdminAccess = [USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(this.props.user.role)

        // animateStyle is passed in and handled by react-motion
        return <div className="c_mobileMenu" style={this.props.animateStyle}>
            <Row>
                <Col className="right-align">
                    <Icon className="closeMobileMenu" type="menu-unfold" onClick={this.props.toggleMobileMenu}/>
                </Col>
            </Row>
            <Row>
                <Col className="menuContainer">
                    <Menu
                        onClick={this.handleMenuClick.bind(this)}
                        mode="inline"
                    >
                        {isLogin &&
                            <Menu.Item key="profile/info">
                                <img src="/assets/images/avatar.png" /> {this.props.user.username}
                            </Menu.Item>
                        }

                        {!isLogin &&
                        <Menu.Item key="register">
                            {I18N.get('0202')}
                        </Menu.Item>
                        }
                        {isLogin && hasAdminAccess &&
                        <Menu.Item key="admin/users">
                            {I18N.get('0203')}
                        </Menu.Item>
                        }
                    </Menu>
                </Col>
            </Row>
            <Row>
                <Col className="menuContainer">
                    <Menu
                        onClick={this.handleMenuClick.bind(this)}
                        mode="inline"
                    >
                        {/*<Menu.Item key="about">
                            {I18N.get('0008')}
                        </Menu.Item>*/}
                        {isLogin && <Menu.Item key="dapps/simpledice">
                            Coin Flip
                        </Menu.Item>}
                    </Menu>
                </Col>
            </Row>
        </div>
    }

}
