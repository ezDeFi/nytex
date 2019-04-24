import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import { Menu, SubMenu } from 'antd'
import I18N from '@/I18N'
import { Link } from 'react-router-dom';

import './style.scss'

export default class extends BaseComponent {
    ord_render () {
        // TODO check why we can not use redirect use this.props.history
        return (
            <Menu
                defaultSelectedKeys={[this.props.selectedItem]}
                mode="inline"
            >
                <Menu.Item key="users">
                    <Link to="/admin/users">{I18N.get('1302')}</Link>
                </Menu.Item>
                <Menu.Item key="leaderboard">
                    <Link to="/admin/leaderboard">Leaderboard</Link>
                </Menu.Item>
                <Menu.Item key="transaction">
                    <Link to="/admin/transaction">Transactions</Link>
                </Menu.Item>
                <Menu.Item key="deposits">
                    <Link to="/admin/deposits">Deposits</Link>
                </Menu.Item>
                <Menu.Item key="rewards">
                    <Link to="/admin/rewards">Rewards</Link>
                </Menu.Item>
                <Menu.Item key="refers">
                    <Link to="/admin/refers">Refers</Link>
                </Menu.Item>
            </Menu>
        )
    }
}
