import React from 'react' // eslint-disable-line
import BaseComponent from '@/model/BaseComponent'
import { Layout, Row, Col, Menu, Icon, Modal, Button } from 'antd' // eslint-disable-line
import _ from 'lodash' // eslint-disable-line
import I18N from '@/I18N'
import './style.scss'

import { USER_ROLE } from '@/constant'

const { Header } = Layout // eslint-disable-line

export default class extends BaseComponent {
  componentDidMount() {
    document.title = 'NewSD: Stablecoin Protocol of Nexty'
  }

  buildAcctDropdown() {
    const isLogin = this.props.isLogin
    const hasAdminAccess = [USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(this.props.role)

    return (
      <Menu onClick={this.clickItem.bind(this)}>
        {isLogin
          ? <Menu.Item key="profile">
            {I18N.get('0200')}
          </Menu.Item>
          : <Menu.Item key="login">
            {I18N.get('0201')}
          </Menu.Item>
        }
        {isLogin && hasAdminAccess &&
          <Menu.Item key="admin/tasks">
            {I18N.get('0203')}
          </Menu.Item>
        }
        {isLogin &&
          <Menu.Item key="logout">
            {I18N.get('0204')}
          </Menu.Item>
        }
      </Menu>
    )
  }

  renderHeader() {
    const isLogin = this.props.isLogin
    if (isLogin) {
      return (
        <div>
          <Row type="flex" className="a_Header">
            <Col className="xlogo" style={{ background: '#252C3F' }}>
              <img src='/assets/images/nextyplat.svg' />
            </Col>
              <div style={{width:"2px", background:"#9CA4B9", margin:"10px"}} />
            {/* <Col style={{ width= '1px' }}> */}
            {/* </Col> */}
            {/* <Button className="right-side" onClick={this.logout.bind(this)} ghost>
            <Icon type="logout" />{I18N.get('0204')}
          </Button> */}
          </Row>
        </div>



      )
    } else {
      return (
        <div className="xlogo" style={{ background: '#252C3F' }}>
          <img src='/assets/images/nextyplat.svg' />
        </div>

      )
    }
  }

  ord_render() { // eslint-disable-line

    return (
      <Header style={{
        background: '#252C3F', padding: 0
      }}>
        {this.renderHeader()}
      </Header>
    )
  }

  logout(e) {
    Modal.confirm({
      title: 'Are you sure you want to logout?',
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.props.logout()
      },
      onCancel() {
      }
    })
  }
}
