import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Form, Icon, Input, Button, Checkbox, message, Select, Divider, Collapse, Spin} from 'antd'
import ReCAPTCHA from 'react-google-recaptcha'
import {
    RECAPTCHA_KEY,
    MIN_LENGTH_PASSWORD,
    ADDRESS0X0,
} from '@/config/constant'
import config from '@/config'
import I18N from '@/I18N'
import _ from 'lodash'

import './style.scss'

const FormItem = Form.Item

class C extends BaseComponent {

    ord_states() {
        return {
            requestedCode: null,
            ref: localStorage.getItem('ref') || '',
            loading: false
        }
    }

    handleSubmit(e) {
        e.preventDefault()

        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                if (this.state.requestedCode) {
                    this.setState({loading: true})
                    this.props.registerOnChange(this.state.savedValues.username, this.state.ref || ADDRESS0X0).catch((err) => {
                        this.setState({loading: false})
                        if (_.isFunction(this.props.toggleRegisterModal)) {
                            this.props.toggleRegisterModal()
                        }
                    })

                    this.interval = setInterval(async () => {
                        const isCitizen = await this.props.isCitizen()
                        if (isCitizen) {
                            this.handleRegister()
                            clearInterval(this.interval)
                        }
                    }, 6000)
                } else {

                    // step 1 - check username, if valid send registration code
                    const code = this.generateRegCode()
                    this.props.sendRegistrationCode(values.email, code)

                    this.setState({
                        requestedCode: code,
                        savedValues: values
                    })

                    if (_.isFunction(this.props.onHideTabBar)) {
                        this.props.onHideTabBar()
                    }
                }
            }
        })
    }

    handleRegister() {
        this.props.register(this.state.savedValues.email, this.state.savedValues.username, this.props.walletAddress)
        .then((shouldShowWelcome) => {
            this.setState({loading: false})
            if (_.isFunction(this.props.onChangeActiveKey)) {
                if (shouldShowWelcome) {
                    this.props.onChangeActiveKey('post')
                } else {
                    this.props.onChangeActiveKey('login')
                }
            }

            if (_.isFunction(this.props.toggleRegisterModal)) {
                this.props.toggleRegisterModal()
            }
        })
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    // TODO: move to back-end
    generateRegCode() {
        // Generate a random six digit code
        const min = 100000
        const max = 1000000
        return Math.round(Math.random() * (max - min) + min);
    }

    checkEmail(rule, value, callback, source, options) {
        const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

        if (value && emailRegex.test(value)) {
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

    checkWallet(rule, value, callback, source, options) {
        if (value) {
            this.props.checkWallet(value).then((isExist) => {
                if (isExist) {
                    callback(I18N.get('register.error.duplicate_wallet'))
                } else {
                    callback()
                }
            })
        } else {
            callback()
        }
    }

    checkUsername(rule, value, callback, source, options) {
        if (value) {
            this.props.checkUsername(value).then((isExist) => {
                if (isExist) {
                    callback(I18N.get('register.error.duplicate_username'))
                } else {
                    callback()
                }
            })
        } else {
            callback()
        }
    }

    validateRegCode(rule, value, callback) {
        const reqCode = this.state.requestedCode
        const form = this.props.form

        if (reqCode && reqCode.toString() !== value) {
            callback(I18N.get('register.error.code')) // The code you entered does not match
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

    getConfirmInputProps() {
        const {getFieldDecorator} = this.props.form

        const regCode_fn = getFieldDecorator('reg_code', {
            rules: [{required: true, message: I18N.get('register.form.input_code')},
                {validator: this.validateRegCode.bind(this)}]
        })
        const regCode_el = (
            <Input size="large"
                placeholder={I18N.get('register.form.confirmation_code')}/>
        )

        return {
            regCode: regCode_fn(regCode_el)
        }
    }

    getInputProps() {
        const {getFieldDecorator} = this.props.form

        const username_fn = getFieldDecorator('username', {
            rules: [
                {required: true, message: I18N.get('register.form.label_username')},
                {min: 6, message: I18N.get('register.error.username')},
                {validator: this.checkUsername.bind(this)}
            ],
            initialValue: ''
        })
        const username_el = (
            <Input size="large"
                placeholder={I18N.get('register.form.username')}/>
        )

        const email_fn = getFieldDecorator('email', {
            rules: [{
                required: true, message: I18N.get('register.form.label_email')
            }, {
                type: 'email', message: I18N.get('register.error.email'),
            }, {
                validator: this.checkEmail.bind(this)
            }]
        })
        const email_el = (
            <Input size="large"
                placeholder={I18N.get('register.form.email')}/>
        )

        return {
            userName: username_fn(username_el),
            email: email_fn(email_el),
        }
    }

    getForm() {
        if (this.state.requestedCode) {
            const p = this.getConfirmInputProps()
            return (
                <div>
                    <h3 className="citizen-title komu-a">{I18N.get('register.code.title')}</h3>
                    <Form onSubmit={this.handleSubmit.bind(this)} className="d_registerForm">
                        {this.state.loading ? <Spin /> :
                        <FormItem>
                            {p.regCode}
                        </FormItem>}
                        <FormItem>
                            <Button loading={this.props.loading} type="ebp" htmlType="submit" className="d_btn d_btn_join" onClick={this.handleSubmit.bind(this)}>
                                Confirm
                            </Button>
                        </FormItem>
                        <Divider className="code-sent-text">
                            {I18N.get('register.code')}
                            <span className="code-email">{this.state.savedValues.email}</span>
                        </Divider>
                    </Form>
                </div>
            )
        } else {
            const p = this.getInputProps()
            return (
                <Form onSubmit={this.handleSubmit.bind(this)} className="d_registerForm">
                    <h2 className="title-form">Register</h2>
                    <FormItem>
                        {p.email}
                    </FormItem>
                    <FormItem>
                        {p.userName}
                    </FormItem>
                    <FormItem>
                        <Button loading={this.props.loading} type="ebp" htmlType="submit" className="d_btn d_btn_join" onClick={this.handleSubmit.bind(this)}>
                            {I18N.get('register.submit')}
                        </Button>
                    </FormItem>
                </Form>
            )
        }
    }

    ord_render() {
        const form = this.getForm()

        return (
            <div className="c_registerContainer">
                {this.props.walletAddress ? form : (
                    <div>
                        <div><img width="150px" src="/assets/images/metamask.png" /></div>
                        <div className="register-metamask">
                            <h1 className="register-metamask-title">Please log in to MetaMask to proceed</h1>
                            <p>You can install Metamask via this link <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">Metamask</a></p>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default Form.create()(C)
