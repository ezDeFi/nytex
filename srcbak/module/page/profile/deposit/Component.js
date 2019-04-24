import React from 'react'
import ProfilePage from '../../ProfilePage'
import Navigator from '@/module/page/shared/HomeNavigator/Container'
import I18N from '@/I18N'

import DepositList from './List/Container'

import './style.scss'
import '../../admin/admin.scss'

import { Col, Row, Icon, Form, Breadcrumb, Button, Dropdown } from 'antd'
const FormItem = Form.Item

import MediaQuery from 'react-responsive'

export default class extends ProfilePage {

    async componentDidMount() {
        await super.componentDidMount()
        await this.props.getDepositList({
            userId: this.props.user.current_user_id
        })
    }

    onChangeDatePicker(date, dateString) {
        this.props.getDepositList({
            userId: this.props.user.current_user_id,
            startDate: dateString[0],
            endDate: dateString[1]
        })
    }

    ord_renderContent() {
        return (
            <div>
                <div className="ebp-header-divider">

                </div>
                <div className="p_admin_index ebp-wrap">
                    <div className="d_box">
                        <div className="p_admin_breadcrumb">
                            <Breadcrumb>
                                <Breadcrumb.Item href="/">
                                    <Icon type="home" />
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>{I18N.get('0200')}</Breadcrumb.Item>
                                <Breadcrumb.Item>Deposit History</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div className="p_Profile p_admin_content">
                            <MediaQuery maxWidth={720}>
                                <Row>
                                    <Col className="wrap-box-navigator">
                                        <Navigator selectedItem={'deposit'} />
                                    </Col>
                                </Row>
                            </MediaQuery>
                            <Row>
                                <MediaQuery minWidth={720}>
                                    <Col span={4} className="admin-left-column wrap-box-navigator">
                                        <Navigator selectedItem={'deposit'} />
                                    </Col>
                                </MediaQuery>
                                <Col xs={{span: 24}} md={{span: 20}} className="c_ProfileContainer admin-right-column wrap-box-user">
                                    <DepositList onChangeDatePicker={this.onChangeDatePicker.bind(this)} list={this.props.list} loading={this.props.loading}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <br/>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
