import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import { Menu, SubMenu } from 'antd'
import MediaQuery from "react-responsive"
import I18N from '@/I18N'
import { Link } from 'react-router-dom';
import { Affix, Radio, Badge, Tooltip, Icon } from 'antd';
import './style.scss'
import {MAX_WIDTH_MOBILE, MIN_WIDTH_PC} from "../../../../config/constant"

export default class extends BaseComponent {

    ord_states() {
        return {
            navItem: 1
        };
    }

    handlePageChange(value) {
        this.setState({
            navItem: value
        })
    }

    handleMenuClick(item, key, keyPath) {

        switch (item.key) {
            case 'profileInfo':
                this.props.history.push('/profile/info')
                break
            case 'deposit':
                this.props.history.push('/profile/deposit')
                break
            case 'reward':
                this.props.history.push('/profile/reward')
                break
            case 'transaction':
                this.props.history.push('/profile/transaction')
                break
        }
    }

    isProfileIncomplete() {
        const isEmptyChecks = [
            'firstName',
            'lastName',
            'country',
            'avatar'
        ]

        return !_.every(_.map(isEmptyChecks, (prop) =>
            !_.isEmpty(this.props.user.profile[prop])))
    }

    ord_render () {
        // TODO check why we can not use redirect use this.props.history
        return (
            <div className="navigator">
                <div className="user">
                    <div className="avatar"><img src="/assets/images/big-avatar.png" /></div>
                    <div className="username">{this.props.user.username}</div>
                </div>
                <MediaQuery minWidth={MIN_WIDTH_PC}>
                    <Affix offsetTop={15}>
                        <Menu
                            className="no-padding-items"
                            defaultSelectedKeys={[this.props.selectedItem]}
                            onClick={this.handleMenuClick.bind(this)}
                            mode="inline"
                        >
                            <Menu.Item key="profileInfo">
                                {I18N.get('2300')}
                            </Menu.Item>
                            {/*<Menu.Item key="transaction">
                                <Icon type="barcode" />Transaction
                            </Menu.Item>
                            <Menu.Item key="deposit">
                                <Icon type="wallet" />Deposit
                            </Menu.Item>
                            <Menu.Item key="reward">
                                <Icon type="gift" />Reward
                            </Menu.Item>*/}
                        </Menu>
                    </Affix>
                </MediaQuery>
                <MediaQuery maxWidth={MAX_WIDTH_MOBILE}>
                    <Menu
                        className="menu-mobile"
                        defaultSelectedKeys={[this.props.selectedItem]}
                        onClick={this.handleMenuClick.bind(this)}
                        mode="horizontal"
                    >
                        <Menu.Item key="profileInfo">
                            {I18N.get('2300')}
                        </Menu.Item>
                        {/*<Menu.Item key="transaction">
                            <Icon type="barcode" />Transaction
                        </Menu.Item>
                        <Menu.Item key="deposit">
                            <Icon type="wallet" />Deposit
                        </Menu.Item>
                        <Menu.Item key="reward">
                            <Icon type="gift" />Reward
                        </Menu.Item>*/}
                    </Menu>
                </MediaQuery>
            </div>
        )
    }
}
