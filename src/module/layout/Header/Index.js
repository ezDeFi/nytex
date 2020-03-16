import React                         from 'react'
import {useSelector}                 from "react-redux";
import {Layout, Icon, Modal, Button} from 'antd'
import UserService                   from '@/service/UserService'
import './style.scss'

const {Header} = Layout

const HeaderComponent = () => {
  document.title     = 'Nexty ...'
  const userService  = new UserService()
  const isLogin = useSelector(state => state.user.is_login)

  const renderHeader = () => {
    if (isLogin) {
      return (
        <Button className="right-side" onClick={logout} ghost>
          <Icon type="logout"/> logout
        </Button>
      )
    } else {
      return (
        <div className="xlogo" style={{background: '#0d47a1'}}>
          <link rel="shortcut icon" href="assets/images/btc.gif"/>
        </div>
      )
    }
  }

  const logout = (e) => {
    Modal.confirm({
      title     : 'Are you sure you want to logout?',
      content   : '',
      okText    : 'Yes',
      okType    : 'danger',
      cancelText: 'No',
      onOk      : async () => {
        const rs = await userService.logout()
        if (rs) {
          message.success('Log out successfully')
          userService.path.push('/login')
        }
      },
      onCancel() {
      }
    })
  }

  return (
    <Header style={{background: '#0d47a1', padding: 0}}>
      {renderHeader()}
    </Header>
  )

}

export default HeaderComponent