import React, {useState}                      from 'react'
import {Menu, Dropdown, Row, Col} from 'antd'
import {Link} from "react-router-dom";
import "antd/dist/antd.css";
import './style.scss'

const Header = () => {
  let currentLanguage = localStorage.getItem('language')
  const [language, setLanguage] = useState(currentLanguage ? currentLanguage : 'vietnamese')

  const changeLanguage = (language) => {
    localStorage.setItem('language', language);
    setLanguage(language)
  }

  const LanguageSetting = <Menu>
    <Menu.Item key="0" onClick={() => changeLanguage('vietnamese')}>
      <a href='#'>Vietnamese</a>
    </Menu.Item>
    <Menu.Item key="1" onClick={() => changeLanguage('korean')}>
      <a href='#'>Korean</a>
    </Menu.Item>
    <Menu.Item key="2" onClick={() => changeLanguage('chinese')}>
      <a href='#'>Chinese</a>
    </Menu.Item>
    <Menu.Item key="3" onClick={() => changeLanguage('deutsch')}>
      <a href='#'>Deutsch</a>
    </Menu.Item>
    <Menu.Item key="4" onClick={() => changeLanguage('espanol')}>
      <a href='#'>Espanol</a>
    </Menu.Item>
  </Menu>

  return (
    <Row className="header">
      <Col lg={{span: 3}}
           xs={{span: 12}}
           className="header-logo">
        <span>
          <img src="../../../assets/images/nextyplat.svg" alt=""/>
        </span>
      </Col>
      <Col lg={{span: 12, order: 2}}
           xs={{span: 24, order: 3}} className="header-info">
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
      <Col lg={{span:0}}
        xs={{span:12}}
      >
        menu
      </Col>
      <Col lg={{span: 9, order: 3}}
           xs={{span: 12, order: 2}}
           className="nav"
      >
        <div className="nav-box">
          <span className="nav__exchange nav__item nav__item-exchange">
            <img src='../../../assets/images/exchange.svg' alt="" className="nav-icon"/>
            <Link to="/exchange">Exchange</Link>
          </span>
          <span className="nav__preemptive nav__item nav__item-preemptive">
            <img src='../../../assets/images/preemptive.svg' alt="" className="nav-icon"/>
            <Link to="/preemptive">Preemptive</Link>
          </span>
          <span className="nav__menu nav__item nav__item-language">
            <Dropdown overlay={LanguageSetting} trigger={['click']}>
              <a className='ant-dropdown-link' style={{color: '#6e7793'}} onClick={e => e.preventDefault()}>
                <img src='../../../assets/images/language.svg' alt="" className="nav-icon"/>
                {language}
              </a>
            </Dropdown>
          </span>
        </div>
      </Col>
    </Row>
  )
}

export default Header;