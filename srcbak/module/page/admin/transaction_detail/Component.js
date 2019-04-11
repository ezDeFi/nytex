import React from 'react'
import AdminPage from '../BaseAdmin'
import '../admin.scss'
import './style.scss'
import Navigator from '../shared/Navigator/Component'
import { Breadcrumb, Col, Icon, Row, Spin, Button, Modal, Input, Message, Divider } from 'antd'
import {TASK_STATUS, ETHERS_SCAN} from '@/constant'
import moment from 'moment/moment'

export default class extends AdminPage {

    constructor(props) {
        super(props)
        this.state = {
            hash: null,
            reason: null,
            showModalApprove: false,
            showModalReject: false
        }
    }

    async componentDidMount() {
        await super.componentDidMount()
        const transactionId = this.props.match.params.transactionId
        this.props.getTransaction(transactionId)
    }

    showModalApprove() {
        this.setState({showModalApprove: true})
    }

    closeModalApprove() {
        this.setState({showModalApprove: false})
    }

    showModalReject() {
        this.setState({showModalReject: true})
    }

    closeModalReject() {
        this.setState({showModalReject: false})
    }

    changeReason(e) {
        this.setState({reason: e.target.value})
    }

    changeHash(e) {
        this.setState({hash: e.target.value})
    }

    async approveTransaction() {
        if (!this.state.hash) {
            return Message.error('Please input transaction hash!')
        }

        this.props.approveTransaction({
            transactionId: this.props.transaction._id,
            hash: this.state.hash,
            reason: this.state.reason
        })

        this.resetData()
        this.setState({showModalApprove: false})
    }

    async rejectTransaction() {
        if (!this.state.reason) {
            return Message.error('Please input reason!')
        }

        this.props.rejectTransaction({
            transactionId: this.props.transaction._id,
            reason: this.state.reason
        })

        this.resetData()
        this.setState({showModalReject: false})
    }

    resetData() {
        this.setState({
            hash: null,
            reason: null
        })
    }

    renderApproveModal() {
        return (
            <Modal
                className=""
                title="Approve Transaction"
                visible={this.state.showModalApprove}
                onCancel={this.closeModalApprove.bind(this)}
                width="60%"
                onOk={this.approveTransaction.bind(this)}
                okText="Approve"
                cancelText="Cancel"
            >
                <div className="qr-modal">
                    <Input
                        className="input-privatekey"
                        size="large"
                        onChange={this.changeHash.bind(this)}
                        placeholder="Please import transaction hash"
                    /> <br /><br />
                    <Input
                        className="input-privatekey"
                        size="large"
                        onChange={this.changeReason.bind(this)}
                        placeholder="Please import reason"
                    />
                </div>
            </Modal>
        )
    }

    renderRejectModal() {
        return (
            <Modal
                className=""
                title="Reject Transaction"
                visible={this.state.showModalReject}
                onCancel={this.closeModalReject.bind(this)}
                width="60%"
                onOk={this.rejectTransaction.bind(this)}
                okText="Reject"
                cancelText="Cancel"
            >
                <div className="qr-modal">
                    <Input
                        className="input-privatekey"
                        size="large"
                        onChange={this.changeReason.bind(this)}
                        placeholder="Please import reason"
                    />
                </div>
            </Modal>
        )
    }

    ord_renderContent () {
        if (this.props.loading || !this.props.transaction) {
            return this.renderLoading()
        }

        const transaction = this.props.transaction

        return (

            <div>
                <div className="ebp-header-divider" />
                <div className="p_admin_index ebp-wrap">
                    <div className="d_box">
                        <div className="p_admin_breadcrumb">
                            <Breadcrumb>
                                <Breadcrumb.Item href="/">
                                    <Icon type="home" />
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>Admin</Breadcrumb.Item>
                                <Breadcrumb.Item href="/admin/transaction">Transaction</Breadcrumb.Item>
                                <Breadcrumb.Item>{this.props.transaction._id}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div className="p_admin_content transaction_detail">
                            <Row className="clearfix">
                                <Col span={4} className="admin-left-column wrap-box-navigator">
                                    <Navigator selectedItem={'transaction'}/>
                                </Col>
                                <Col span={20} className="admin-left-column wrap-box-user">
                                    <Divider>Transaction Info</Divider>
                                    <Row>
                                        <Col span={8} className="gridCol right-align">
                                            Transaction ID
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            {transaction._id}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8} className="gridCol right-align">
                                            Status
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            {transaction.status}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8} className="gridCol right-align">
                                            Amount
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            <b>{transaction.amount}</b>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8} className="gridCol right-align">
                                            Username
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            {transaction.userId && transaction.userId.username}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8} className="gridCol right-align">
                                            To Wallet
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            {transaction.toAddress}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8} className="gridCol right-align">
                                            Created Date
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            {moment(transaction.createdAt).format('YYYY-MM-DD HH:MM')}
                                        </Col>
                                    </Row>
                                    <Divider>Check Transaction</Divider>
                                    {transaction.hash && <Row>
                                        <Col span={8} className="gridCol right-align">
                                            Transaction hash
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            <a href={`${ETHERS_SCAN}${transaction.hash}`} target="_blank">Tx Hash</a>
                                        </Col>
                                    </Row>}
                                    {transaction.paidBy && <Row>
                                        <Col span={8} className="gridCol right-align">
                                            Approved By
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            {transaction.paidBy.username}
                                        </Col>
                                    </Row>}
                                    {transaction.paidDate && <Row>
                                        <Col span={8} className="gridCol right-align">
                                            Approved Date
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            {moment(transaction.paidDate).format('YYYY-MM-DD HH:MM')}
                                        </Col>
                                    </Row>}
                                    {transaction.reason && <Row>
                                        <Col span={8} className="gridCol right-align">
                                            Reason
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            {transaction.reason}
                                        </Col>
                                    </Row>}
                                    {transaction.rejectedBy && <Row>
                                        <Col span={8} className="gridCol right-align">
                                            Reject By
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            {transaction.rejectedBy.username}
                                        </Col>
                                    </Row>}
                                    {transaction.rejectedDate && <Row>
                                        <Col span={8} className="gridCol right-align">
                                            Reject Date
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            {moment(transaction.rejectedDate).format('YYYY-MM-DD HH:MM')}
                                        </Col>
                                    </Row>}
                                    <Row>
                                        <Col span={8} className="gridCol right-align">
                                            {transaction.status !== 'APPROVED' && <Button type="primary" onClick={this.showModalApprove.bind(this)}>Approve</Button>}
                                        </Col>
                                        <Col span={16} className="gridCol">
                                            {transaction.status !== 'APPROVED' && <Button type="danger" onClick={this.showModalReject.bind(this)}>Reject</Button>}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                {this.renderApproveModal()}
                {this.renderRejectModal()}
            </div>
        )
    }

    renderLoading(){
        return (
            <div className="flex-center">
                <Spin size="large" />
            </div>

        )
    }
}
