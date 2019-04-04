import React from 'react';
import BaseComponent from '@/model/BaseComponent'
import UserEditForm from '@/module/form/UserEditForm/Container'
import UserProfileForm from '@/module/form/UserProfileForm/Container'
import I18N from '@/I18N'
import { Col, Row, Icon, Popover, Button, Spin, Tabs, Tag, Tooltip, Modal, InputNumber, Input, Message } from 'antd'
import moment from 'moment-timezone'
import clipboardCopy from 'clipboard-copy'
import {CopyToClipboard} from 'react-copy-to-clipboard';

import UserPublicDetail from './detail/Container'

import {USER_AVATAR_DEFAULT, WEB_URL} from '@/constant'
import config from '@/config'
import MediaQuery from 'react-responsive'

import './style.scss'
const copy = require('clipboard-copy')

const TabPane = Tabs.TabPane

/**
 * This has 3 views
 *
 * 1. Public
 * 2. Admin
 * 3. Edit
 *
 */
export default class extends BaseComponent {

    constructor(props) {
        super(props)

        this.state = {
            editing: false,
            editingBasic: false,
            publicView: false,
            reason: '',
            amount: 0.02,
            showModalReward: false
        }
    }

    async componentDidMount() {
        this.props.getMyBalance()
    }

    // TODO: add twitter, telegram, linkedIn, FB
    ord_render () {
        let content = null;
        if (_.isEmpty(this.props.user) || this.props.user.loading) {
            return <div class="center"><Spin size="large" /></div>;
        }

        if (this.state.publicView) {
            content = (
                <div className="member-content">
                    {this.renderHeader()}
                    <div className="container">
                        <UserPublicDetail userId={this.props.currentUserId} page={this.props.page}/>
                    </div>
                </div>
            );
        } else if (this.state.editingBasic) {
            content = (
                <div className="member-content">
                    {this.renderHeader()}
                    <div className="container">
                        <div>
                            <div className="profile-info-container clearfix">
                                <UserProfileForm user={this.props.user}
                                    page={this.props.page} switchEditMode={this.switchEditBasicMode}
                                    updateBanner={(url) => this.setState({temporaryBanner: url})}
                                    updateAvatar={(url) => this.setState({temporaryAvatar: url})}/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            content = (
                <div>
                    <MediaQuery maxWidth={800}>
                        <div className="member-content member-content-mobile">
                            {this.renderMobile()}
                        </div>
                    </MediaQuery>
                    <MediaQuery minWidth={801}>
                        <div className="member-content">
                            {this.renderDesktop()}
                        </div>
                    </MediaQuery>
                </div>
            );
        }

        return (
            <div className="c_Member public">
                {content}
                {this.renderAddRewardModal()}
            </div>
        );
    }

    renderMobile() {
        return (
            <div>
                <div className="profile-info-container profile-info-container-mobile clearfix">
                    {this.renderButton(true)}
                </div>
                {this.renderEditForm()}
            </div>
        )
    }

    renderEditForm() {
        return (
            <UserEditForm user={this.props.user} page={this.props.page} switchEditMode={this.switchEditMode}/>
        )
    }

    copyReferLink() {
        Message.success('Copied!')
    }

    renderDesktop() {
        return (
            <div>
                <div className="profile-info-container clearfix">
                    <div className="profile-left pull-left">
                        {this.renderButton()}
                    </div>
                </div>
                {this.renderEditForm()}
            </div>
        )
    }

    renderHeader() {
        if (this.state.publicView || this.state.editingBasic) {
            const onToggle = this.state.publicView ? this.switchPublicView : this.switchEditBasicMode;
            return (
                <div className="header">
                    <div className="content">
                        {I18N.get(this.state.publicView ? 'profile.publicProfile' : 'profile.edit')}
                    </div>
                    <Icon className="close-btn" type="close" onClick={onToggle} />
                </div>
            )
        }
    }

    renderFullName(isMobile) {
        return (
            <h1 className={`komu-a profile-general-title ${isMobile ? 'profile-general-title-mobile' : ''}`}>
                {this.props.user.profile.firstName}&nbsp;
                {this.props.user.profile.lastName}
                {this.props.is_admin && <Button className="add_rewawrd" onClick={this.showModalReward.bind(this)}>Add Reward</Button>}
            </h1>
        )
    }

    withdrawnBalance() {
        this.props.withdraw(this.props.user.balance)
    }

    showModalReward() {
        this.setState({showModalReward: true})
    }

    closeModalReward() {
        this.setState({showModalReward: false})
    }

    changeAmountAmountReward(value) {
        this.setState({amount: value})
    }

    changeReasonReward(e) {
        this.setState({reason: e.target.value})
    }

    addRewad() {
        this.props.addRewad({
            amount: this.state.amount,
            userId: this.props.user._id,
            reason: this.state.reason
        })
        this.setState({showModalReward: false})
    }

    renderAddRewardModal() {
        return (
            <Modal
                className=""
                title="Add Reward"
                visible={this.state.showModalReward}
                onCancel={this.closeModalReward.bind(this)}
                width="60%"
                onOk={this.addRewad.bind(this)}
                okText="Submit"
                cancelText="Cancel"
            >
                <div className="qr-modal">
                    Amount: <InputNumber
                        size="large"
                        defaultValue={this.state.amount}
                        onChange={this.changeAmountAmountReward.bind(this)}
                    /> ETH <br /><br />
                    <Input
                        className="input-privatekey"
                        size="large"
                        onChange={this.changeReasonReward.bind(this)}
                        placeholder="Reason"
                    />
                </div>
            </Modal>
        )
    }

    renderButton(isMobile) {
        let balance = this.props.user.walletBalance || 0
        let balanceContract = this.props.user.balance || 0

        return (
            <div className={`profile-button ${isMobile ? 'profile-button-mobile' : ''}`}>
                <div className="show-balance">
                    <div className="balance">Game balance {Number(balanceContract / 1e18).toFixed(3)} ETH</div>
                    <div className="balance">Balance {Number(balance).toFixed(3)} ETH</div>
                </div>
                <div>
                    <Button className="show-button-withdrawn" onClick={this.withdrawnBalance.bind(this)}>Withdrawn {Number(balanceContract / 1e18).toFixed(3)} ETH</Button> <Tooltip title="You can withdrawn your balance minimum is 0.05 ETH"><Icon type="question-circle" style={{color: '#D32373'}} /></Tooltip>
                    <CopyToClipboard text={`${WEB_URL}?ref=${this.props.user.walletAddress}`}
                      onCopy={this.copyReferLink.bind(this)}>
                        <Button className="btn-copy-refer">Copy refer link</Button>
                    </CopyToClipboard>
                </div>
            </div>
        )
    }

    renderLocation(isMobile) {
        return (
            <div className={`profile-general-info ${isMobile ? 'profile-general-info-mobile' : ''}`}>
                <i class="fas fa-map-marker-alt location-icon"></i>
                <span>
                    {this.getCountryName(this.props.user.profile.country)}
                </span>
            </div>
        )
    }

    renderSkillsets(isMobile) {
        return (
            <div className={`profile-skillset-info ${isMobile ? 'profile-skillset-info-mobile' : ''}`}>
                {_.map(this.props.user.profile.skillset || [], (skillset) =>
                    <Tag color="blue" key={skillset}>
                        {I18N.get(`user.skillset.${skillset}`)}
                    </Tag>
                )}
            </div>
        )
    }

    getBannerWithFallback(banner) {
        return _.isEmpty(banner)
            ? `url('/assets/images/profile-banner.png')`
            : `url(${banner})`
    }

    getAvatarWithFallback(avatar) {
        return _.isEmpty(avatar)
            ? USER_AVATAR_DEFAULT
            : avatar
    }

    getCountryName(countryCode) {
        return config.data.mappingCountryCodeToName[countryCode]
    }

    switchEditBasicMode = () => {
        this.setState({
            editingBasic: !this.state.editingBasic,
            temporaryAvatar: null,
            temporaryBanner: null
        })
    }

    switchEditMode = () => {
        this.setState({
            editing: !this.state.editing,
            temporaryAvatar: null,
            temporaryBanner: null
        })
    }

    switchPublicView = () => {
        this.setState({
            publicView: !this.state.publicView,
            temporaryAvatar: null,
            temporaryBanner: null
        })
    }

}
