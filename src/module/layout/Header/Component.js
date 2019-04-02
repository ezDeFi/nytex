import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Affix, Layout, Menu, Icon, Badge, Avatar, Modal, Dropdown, Popover, Select} from 'antd'
import _ from 'lodash'
import I18N from '@/I18N'
import MediaQuery from 'react-responsive'
import Flyout from './Flyout';
import {MAX_WIDTH_MOBILE, MIN_WIDTH_PC} from '@/config/constant'
import {USER_ROLE, USER_LANGUAGE} from '@/constant'
import RegisterForm from '@/module/form/RegisterForm/Container';
import Flag from 'react-flags'

const {Header} = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

export default class extends BaseComponent {
    constructor() {
        super();
        this.state = {
            affixed: false,
            popover: false
        }
    }

    buildLanguageDropdown() {
        return (
            <Select defaultValue={I18N.getLang()} style={{ width: 24+11+11 }} onChange={this.props.changeLanguage}>
                <Select.Option value="en">
                    <Flag name="US" format="png"
                        basePath="/assets/images/flags"
                        pngSize={24} shiny={true} alt="English"/>
                </Select.Option>
                <Select.Option value="zh">
                    <Flag name="CN" format="png"
                        basePath="/assets/images/flags"
                        pngSize={24} shiny={true} alt="Chinese"/>
                </Select.Option>
            </Select>
        )
    }

    showRegisterModal() {
        this.props.toggleRegisterModal(true)
    }

    showRegisterModalOk = (e) => {
        this.props.toggleRegisterModal(false)
    }

    showRegisterModalCancel() {
        this.props.toggleRegisterModal(false)
    }

    toggleRegisterModal() {
        this.props.toggleRegisterModal(!this.showRegisterModal)
    }

    renderShowRegisterModal() {
        return (
            <Modal
                className="register"
                maskClosable={false}
                visible={this.props.showRegisterModal}
                onOk={this.showRegisterModalOk.bind(this)}
                onCancel={this.showRegisterModalCancel.bind(this)}
                footer={null}
                width="60%"
            >
                {this.props.showRegisterModal &&
                    <RegisterForm toggleRegisterModal={this.toggleRegisterModal.bind(this)} />
                }
            </Modal>
        )
    }

    getSelectedKeys() {
        const keys = _.map(['profile','about', 'slack', 'admin', 'leaderboard', 'bank', 'dapps/simpledice'], (key) => {
            return ((this.props.pathname || '').indexOf(`/${key}`) === 0) ? key : ''
        })

        return keys
    }

    gotoProfilePage() {
        this.props.history.push('/profile/info')
    }

    ord_render() {
        const isLogin = this.props.isLogin

        const hasAdminAccess = [USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(this.props.role)

        return (
            <div>
                <Header className="c_Header">
                    <div className="main-menu">
                        <Menu onClick={this.clickItem.bind(this)} className="c_Header_Menu pull-left"
                            selectedKeys={this.getSelectedKeys()} mode="horizontal">
                            <Menu.Item className="c_MenuItem logo" key="landing">
                                <img src="/assets/images/logo.png" alt="The Bet"/>
                            </Menu.Item>
                        </Menu>

                        <Menu className="c_Header_Menu c_Side_Menu pull-right">
                            <Menu.Item className="c_MenuItem mobile" key="mobileMenu" onClick={this.props.toggleMobileMenu}>
                                <Icon type="menu-fold"/>
                            </Menu.Item>
                            {/*<Menu.Item className="mobile-language-dropdown" style={{marginTop: 13}}>
                                <MediaQuery maxWidth={MAX_WIDTH_MOBILE}>
                                    <div className="pull-right language-dropdown mobile">
                                        {this.buildLanguageDropdown()}
                                    </div>
                                </MediaQuery>
                            </Menu.Item>*/}
                        </Menu>

                        {/*<MediaQuery minWidth={MIN_WIDTH_PC}>
                            <div className="pull-right language-dropdown">
                                {this.buildLanguageDropdown()}
                            </div>
                        </MediaQuery>*/}
                        <Menu onClick={this.clickItem.bind(this)} className="c_Header_Menu pull-left menu-link" selectedKeys={this.getSelectedKeys()} mode="horizontal">

                            <Menu.Item className="c_MenuItem link" key="dapps/simpledice">
                                Coin Flip
                            </Menu.Item>
                            {/*<Menu.Item className="c_MenuItem link" key="about">
                                {I18N.get('0008')}
                            </Menu.Item>
                            <Menu.Item className="c_MenuItem link" key="bank">
                                Bank
                            </Menu.Item>*/}

                            {this.props.isLogin && hasAdminAccess &&
                                <Menu.Item className="c_MenuItem link" key="admin">
                                    <Icon style={{ color: 'red' }} type="setting" />{I18N.get('0203')}
                                </Menu.Item>
                            }
                        </Menu>
                        <MediaQuery minWidth={MIN_WIDTH_PC}>
                            {this.props.isLogin ? <div onClick={this.gotoProfilePage.bind(this)} className="avatar">
                                <span className="balance">{this.props.user.walletBalance.toFixed(3)} ETH</span>
                                <span className="username">{this.props.username}</span> <img src="/assets/images/avatar.png" />
                            </div> :
                            <div onClick={this.showRegisterModal.bind(this)} className="avatar">
                                <span className="username">{I18N.get('0202')}</span>
                            </div>
                            }
                        </MediaQuery>
                    </div>
                </Header>
                {this.renderShowRegisterModal()}
            </div>
        )
    }

    clickItem(e) {

        const key = e.key

        if (_.includes([
            'landing',
            'home',
            'signup',
            'profile/info',
            'dapps/simpledice',
            'admin/users',
            'help',
            'about',
            'faq',
            'contact',
            'slack',
            'leaderboard',
            'bank'
        ], key)) {

            if (key === 'landing') {
                this.props.history.push('/')
            } else {
                this.props.history.push('/' + e.key)
            }

        } else if (key === 'logout') {
            this.props.logout()
        } else if (key === 'profile') {
            this.props.history.push('/profile/info')
        } else if (key === 'register') {
            this.props.toggleRegisterModal(true)
        } else if (key === 'admin') {
            this.props.history.push('/admin/users')

        } else if (_.includes([
            'en',
            'zh'
        ], key)) {
            this.props.changeLanguage(e.key);
        }
    }
}
