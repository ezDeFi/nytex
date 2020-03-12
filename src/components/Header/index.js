import React                                                    from 'react'
import {Layout, Menu, Icon, Modal, Button, Dropdown, Row, Col,} from 'antd'
import styles                                                   from './header.module.css'
import nextyplat                                                from '../../images/nextyplat.svg'
import languageLogo from '../../images/language.svg'
import exchangeLogo from '../../images/exchange.svg'
import preemptiveLogo from '../../images/preemptive.svg'

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

const Header = () => {
  return (
    <>
      <Row >
        <Col lg={{span:3}}
             xs={{span:6}}
           className={styles.headerLogo}>
          <img src={nextyplat} alt=""/>
        </Col>
        <Col lg={{span:12, order: 2}} xs={{span:24, order: 3}} className={styles.headerInfo} >
          <div>
            <p>last price</p>
            <p>0.0234271</p>
          </div>
          <div><p className={styles.balance}>$175.12354856</p></div>
          <div>
            <p>24h Change</p>
            <p><span>-0.01</span><span>-1.69</span></p>
          </div>
          <div>
            <p>24h high</p>
            <p>0.024844</p>
          </div>
          <div>
            <p>24h Low</p>
            <p>0.0226174</p>
          </div>
          <div>
            <p>24h volume</p>
            <p>468.428</p>
          </div>
        </Col>
        <Col lg={{span:9, order:3}}
             xs={{span:18, order:2}}
             className={styles.nav}
        >
          <span className={styles[`nav__exchange`] + ' ' + styles['nav__item']}>
            <img src={exchangeLogo} alt="" className={styles.navIcon}/>
            Exchange
          </span>
          <span className={styles[`nav__preemptive`] + ' ' + styles['nav__item']}>
            <img src={preemptiveLogo} alt="" className={styles.navIcon}/>
            Preemptive
          </span>
          <span className={styles[`nav__menu`] + ' ' + styles['nav__item']}>
            <Dropdown overlay={menu} trigger={['click']}>
              <a className='ant-dropdown-link' style={{color: '#6e7793'}} onClick={e => e.preventDefault()}>
                <img src={languageLogo} alt="" className={styles.navIcon}/>
                Language
              </a>
            </Dropdown>
          </span>
        </Col>
      </Row>
    </>
  )
}

export default Header;