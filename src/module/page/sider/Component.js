import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import {Layout, Avatar, Form, Button, List, Input, Icon} from 'antd'
import './style'
import { Modal } from 'antd/lib/index'
import _ from 'lodash'
import I18N from '@/I18N'
import {USER_ROLE, USER_LANGUAGE} from '@/constant'
import moment from 'moment'
import ScrollToBottom from 'react-scroll-to-bottom'
import { css } from 'glamor'

const { Sider, Content, Comment } = Layout
const TextArea = Input.TextArea;

const ROOT_CSS = css({
    height: '100%'
})

class C extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            comments: [],
            submitting: false,
            value: '',
        }
    }

    componentDidMount() {
        this.props.getMessages({
            roomId: process.env.ROOM_ID,
            results: 100,
            page: 1
        })
    }

    handleSubmitChat = (e) => {
        e.preventDefault()

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.emitMessage({message: values.message, roomId: process.env.ROOM_ID})
                this.props.form.setFields({message: ''})
            }
        })
    }

    getEditor() {
        const {getFieldDecorator} = this.props.form

        const chat_fn = getFieldDecorator('message', {
            rules: [{required: true, message: 'Please input your message'}]
        })
        const chat_el = (
            <Input.TextArea rows={2} className="input-chat-el" disabled={this.state.submitting}
                placeholder={'Type your message'}
                onPressEnter={this.handleSubmitChat.bind(this)}
            />
        )

        const chat = chat_fn(chat_el)

        return (
            <Form onSubmit={this.handleSubmitChat.bind(this)}>
                <Form.Item className="chat-input item-request-margin">
                    {chat}
                </Form.Item>
                <Button loading={this.state.submitting} className="button-send d_btn pull-right" type="primary" htmlType="submit">
                    Send
                </Button>
            </Form>
        )
    }

    goToLoginPage() {
        this.props.toggleRegisterModal(true)
    }

    ord_render () {
        const isLogin = this.props.user.is_login
        const { comments, submitting, value } = this.state

        if (!this.props.collapsed) {
            return null
        }

        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={false}
                style={{
                  overflow: 'auto', height: '100vh', position: 'fixed', right: 0,
                }}
            >
                <div className="main-chat">
                    <div className="title"><h5><Icon className="chat-close" onClick={this.props.toggle.bind(this)} type="close-circle" style={{ fontSize: '18px', color: '#fff' }} /> Chat Room</h5></div>
                    <div className="list">
                        <ScrollToBottom className={ ROOT_CSS }>
                            <List
                                itemLayout="horizontal"
                                dataSource={this.props.user.messages}
                                renderItem={(item, ind) => (
                                    <List.Item key={ind}>
                                        <div>
                                            <b>{item.user ? item.user.username : 'Anonymous'}</b>: {item.text}
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </ScrollToBottom>
                    </div>
                    <div className="editor">
                        {this.props.is_login ? this.getEditor() : (<Button className="button-login d_btn" onClick={this.goToLoginPage.bind(this)} >Register To Chat</Button>)}
                    </div>
              </div>
            </Sider>
        )
    }
}

export default Form.create()(C)
