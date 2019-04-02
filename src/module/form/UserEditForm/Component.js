import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {
    Form,
    Icon,
    Input,
    InputNumber,
    Button,
    Checkbox,
    Radio,
    Select,
    Message,
    Row,
    Col,
    Upload,
    Cascader,
    Divider,
    TreeSelect
} from 'antd'
import config from '@/config'
import { MIN_LENGTH_PASSWORD } from '@/config/constant'
import TimezonePicker from 'react-timezone'
import I18N from '@/I18N'
import {upload_file} from '@/util'
import './style.scss'
import {TASK_CATEGORY, TASK_TYPE, TASK_STATUS, USER_GENDER, USER_SKILLSET, WEB_URL} from '@/constant'

const FormItem = Form.Item
const TextArea = Input.TextArea
const RadioGroup = Radio.Group

/**
 * This is generic task create form for both Developer and Social Bounties / Events
 *
 * Which version of the form depends on the leader's program
 *
 * Leaders - can create:
 * - Events (offline) restricted to their area - must be approved
 * - Events (online) anywhere - Social or Developer
 *
 * TODO: in the future we should developer leaders
 *
 * Community Leaders - each community has a leader
 * - a leader can create events in their own local community or online community
 * - local offline events are automatically shown in their local community, a country leader
 *  can create events in any child community
 * - these events are shown in the Social page as well
 * - a local event can have sub tasks, these are shown as tasks in the Social page
 */
class C extends BaseComponent {

    constructor(props) {
        super(props)

        this.state = {
            communityTrees: [],
        }
    }

    handleSubmit (e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.updateUser(values, this.state).then(() => {
                    this.props.getCurrentUser()
                });
                this.props.switchEditMode()
            }
        })
    }

    checkEmail(rule, value, callback, source, options) {
        const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

        if (this.props.is_admin && value && emailRegex.test(value) && this.props.user.email !== value) {
            this.props.checkEmail(value).then((isExist) => {
                if (isExist) {
                    callback(I18N.get('register.error.duplicate_email'))
                } else {
                    callback()
                }
            })
        } else {
            callback()
        }
    }

    compareToFirstPassword(rule, value, callback) {
        const form = this.props.form
        if (value && value !== form.getFieldValue('password')) {
            callback(I18N.get('register.error.passwords')) // Two passwords you entered do not match'
        } else {
            callback()
        }
    }

    validateToNextPassword(rule, value, callback) {
        const form = this.props.form
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirmPassword'], { force: true })
        }
        if (value && value.length < MIN_LENGTH_PASSWORD) {
            callback(`${I18N.get('register.error.password_length_1')} ${MIN_LENGTH_PASSWORD} ${I18N.get('register.error.password_length_2')}`)
        }
        callback()
    }

    getSkillsets() {
        return _.map(USER_SKILLSET, (skillsets, category) => {
            return {
                title: I18N.get(`user.skillset.group.${category}`),
                value: category,
                key: category,
                children: _.map(skillsets, (skillset) => {
                    return {
                        title: I18N.get(`user.skillset.${skillset}`),
                        value: skillset,
                        key: skillset
                    }
                })
            }
        })
    }

    getInputProps () {

        const {getFieldDecorator} = this.props.form
        const user = this.props.user

        /*
        ****************************************************************************************
        * General
        ****************************************************************************************
         */
        const username_fn = getFieldDecorator('username', {
            rules: [{required: true, message: I18N.get('from.UserEditForm.username.required')}],
            initialValue: user.username
        })
        const username_el = (
            <Input disabled/>
        )

        const email_fn = getFieldDecorator('email', {
            rules: [{
                required: true, message: I18N.get('user.edit.form.label_email')
            }, {
                type: 'email', message: I18N.get('register.error.email'),
            }, {
                validator: this.checkEmail.bind(this)
            }],
            initialValue: user.email
        })
        const email_el = (
            <Input />
        )

        const walletAddress_fn = getFieldDecorator('walletAddress', {
            rules: [
                {len: 42, message: I18N.get('from.UserEditForm.walletAddress.len')}
            ],
            initialValue: user.walletAddress
        })
        const walletAddress_el = (
            <Input disabled/>
        )

        return {
            // General
            username: username_fn(username_el),
            email: email_fn(email_el),
            walletAddress: walletAddress_fn(walletAddress_el),
        }
    }

    ord_render () {
        const {getFieldDecorator} = this.props.form
        const p = this.getInputProps()

        const formItemLayout = {
            colon: false,
            labelCol: {
                xs: {span: 12},
                sm: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        }

        return (
            <div className="c_userEditFormContainer">
                <Form onSubmit={this.handleSubmit.bind(this)} className="d_taskCreateForm">
                    <div>
                        <div className="label">{I18N.get('user.edit.form.section.general')}</div>
                        <FormItem label={I18N.get('1202')} {...formItemLayout}>
                            {p.email}
                        </FormItem>
                        <FormItem label={I18N.get('from.UserEditForm.label.wallet')} {...formItemLayout}>
                            {p.walletAddress}
                        </FormItem>
                        <FormItem wrapperCol={{xs: {span: 24, offset: 0}, sm: {span: 12, offset: 10}}}>
                            <Button className="cr-btn" type="primary" htmlType="submit" loading={this.props.loading}>
                                {I18N.get('profile.save')}
                            </Button>
                        </FormItem>
                        <br />
                    </div>
                </Form>
            </div>
        )
    }

}
export default Form.create()(C)
