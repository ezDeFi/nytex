import React from 'react' // eslint-disable-line
import BaseComponent from '@/model/BaseComponent'
import { Layout, Menu, Icon, Modal, Button, Dropdown } from 'antd' // eslint-disable-line
import _ from 'lodash' // eslint-disable-line
import I18N from '@/I18N'
import './style.scss'
import { USER_ROLE } from '@/constant'


const { Header } = Layout // eslint-disable-line
const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href='https://#'>Vietnamese</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href='https://#'>Korean</a>
    </Menu.Item>
    <Menu.Item key="2">
      <a href='https://#'>Chinese</a>
    </Menu.Item>
    <Menu.Item key="3">
      <a href='https://#'>Deutsch</a>
    </Menu.Item>
    <Menu.Item key="4">
      <a href='https://#'>Espanol</a>
    </Menu.Item>
  </Menu>
);


export default class extends BaseComponent {
  componentDidMount() {
    document.title = 'NewSD: Stablecoin Protodiv of Nexty'
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
        <div id="top_Header">
          <div className="a_Header">
            <div className="xlogo" style={{ background: '#252C3F' }}>
              <img src='/assets/images/nextyplat.svg' />
            </div>

            <div style={{ width: "2px", background: "#9CA4B9", marginLeft: '14px', marginRight: '11px' }} />

            <div className="last_price">
              <div className="a_Index_top">
                Last Price
              </div>
              <div className="a_Index_bottom">
                <div style={{ maxWidth: '65px', maxHeight: '15px', marginRight: '12px' }}>$0.0234271</div>
                <div style={{ maxWidth: '95px', maxHeight: '15px', color: '#00C28E' }}>$175.6060275</div>
              </div>
            </div>

            <div className="daily_change">
              <div className="a_Index_top">
                24h Change
              </div>
              <div className="a_Index_bottom">
                <div style={{ maxWidth: '35px', maxHeight: '15px', marginRight: '14px' }}>-0.01</div>
                <div style={{ maxWidth: '45px', maxHeight: '15px' }}>-1.69%</div>
              </div>
            </div>

            <div className="daily_change">
              <div className="a_Index_top">
                24h High
              </div>
              <div className="a_Index_bottom">
                $0.024844
              </div>
            </div>

            <div className="daily_change">
              <div className="a_Index_top">
                24h Low
              </div>
              <div className="a_Index_bottom">
                $0.0226174
              </div>
            </div>

            <div className="daily_change">
              <div className="a_Index_top">
                24h Volume
              </div>
              <div className="a_Index_bottom">
                $486.4418
              </div>
            </div>
          </div>

          <div className="b_Header">
            
            <div style={{ textAlign:"end" }} className="exchange">
              <a href='https://#' style={{ color: '#FAB416' }}><img src='/assets/images/exchange.svg' /> Exchange</a>
            </div>

            <div style={{ textAlign:"center" }} className="exchange">
              <a href='https://#' style={{ color: '#6e7793' }}><img src='/assets/images/preemptive.svg' /> Preemptive</a>
            </div>

            <div className="exchange">
              <a href='https://#'><img src='/assets/images/wallet.svg'></img></a>
            </div>

            <div className="language">
              <Dropdown overlay={menu} trigger={['click']}>
                <a className='ant-dropdown-link' style={{ color: '#6e7793' }} onClick={e => e.preventDefault()}>
                  <img src='/assets/images/language.svg' /> English 
                  <Icon type="caret-down" style={{ lineHeight: '15px' }} />
                </a>
              </Dropdown>
            </div>
          </div>

          {/* <div style={{ width= '1px' }}> */}
          {/* </div> */}
          {/* <Button className="right-side" onClick={this.logout.bind(this)} ghost>
            <Icon type="logout" />{I18N.get('0204')}
          </Button> */}


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
      <Header>
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
