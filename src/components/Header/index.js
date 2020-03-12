import React                                                    from 'react'
import {Menu, Dropdown, Row, Col} from 'antd'
import './header.scss'
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
      <Row className="header">
        <Col lg={{span:3}}
             xs={{span:6}}
           className="header-logo">
          <span>
            <img src={nextyplat} alt=""/>
          </span>
        </Col>
        <Col lg={{span:12, order: 2}} xs={{span:24, order: 3}} className="header-info">
          <div>
            <p>last price</p>
            <p>0.0234271</p>
          </div>
          <div><p className="balance">$175.12354856</p></div>
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
        {/*<Col lg={{span:0}}*/}
        {/*  xs={{span:2, order: 2, offset:14}}*/}
        {/*>*/}
        {/*  menu*/}
        {/*</Col>*/}
        <Col lg={{span:9, order:3}}
             xs={{span:18, order:2}}
             className="nav"
        >
          <div className="nav-box">
            <span className="nav__exchange nav__item nav__item-exchange">
              <img src={exchangeLogo} alt="" className="nav-icon"/>
              Exchange
            </span>
            <span className="nav__preemptive nav__item nav__item-preemptive">
              <img src={preemptiveLogo} alt="" className="nav-icon"/>
              Preemptive
            </span>
            <span className="nav__menu nav__item nav__item-language">
              <Dropdown overlay={menu} trigger={['click']}>
                <a className='ant-dropdown-link' style={{color: '#6e7793'}} onClick={e => e.preventDefault()}>
                  <img src={languageLogo} alt="" className="nav-icon"/>
                  Language
                </a>
              </Dropdown>
            </span>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Header;