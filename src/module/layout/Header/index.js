import React, {useState, useEffect} from 'react'
import {Menu, Dropdown, Row, Col}   from 'antd'
import {Link}                       from "react-router-dom";
import {useLocation}                from 'react-router-dom'
import {cutFloat}                   from '@/util/help.js'
import {useSelector}                from "react-redux";
import "antd/dist/antd.css";
import './style.scss'
import {weiToNTY}                   from '@/util/help.js'
import ApiService                   from "../../../service/ApiService";
import I18N from '@/I18N'

const Header = () => {
  let currentLanguage           = localStorage.getItem('language')
  const apiService              = new ApiService()
  const [language, setLanguage] = useState(currentLanguage ? currentLanguage : 'vietnamese')
  const ntyQuote                = useSelector(state => state.common.ntyQuote)
  const balance                 = useSelector(state => state.user.balance)
  let pathname                  = useLocation().pathname;
  const {SubMenu}               = Menu

  const changeLanguage = (language) => {
    localStorage.setItem('language', language);
    setLanguage(language)
  }

  useEffect(() => {
    apiService.loadNtyQuote()
  }, [])


  const languageItem = [
    <Menu.Item key="0" onClick={() => changeLanguage('Vietnamese')}>
      <a href='#' className="text-white"> {I18N.get('0200')}</a>
    </Menu.Item>,
    <Menu.Item key="0" onClick={() => changeLanguage('English')}>
      <a href='#' className="text-white">English</a>
    </Menu.Item>,
    <Menu.Item key="1" onClick={() => changeLanguage('Korean')}>
      <a href='#'>Korean</a>
    </Menu.Item>,
    <Menu.Item key="2" onClick={() => changeLanguage('Chinese')}>
      <a href='#'>Chinese</a>
    </Menu.Item>,
    <Menu.Item key="3" onClick={() => changeLanguage('Deutsch')}>
      <a href='#'>Deutsch</a>
    </Menu.Item>,
    <Menu.Item key="4" onClick={() => changeLanguage('Espanol')}>
      <a href='#'>Espanol</a>
    </Menu.Item>
  ]

  const LanguageSetting = <Menu>
    {languageItem}
  </Menu>

  const CurrentLanguage = (
    <a className='ant-dropdown-link nav__dropdown-item' style={{color: '#6e7793'}} onClick={e => e.preventDefault()}>
      <svg className="nav__icon">
        <use xlinkHref="../../../assets/images/sprite.svg#icon-language"></use>
      </svg>
      {language}
    </a>
  )

  const MenuOnMobile = <Menu>
    <Menu.Item key="10" onClick={() => changeLanguage('vietnamese')}>
      <Link to="/exchange" className={"nav__dropdown-item " + (pathname === '/exchange' ? 'nav__item--choosing' : '')}>
        <svg className="nav__icon">
          <use xlinkHref="../../../assets/images/sprite.svg#icon-exchange"></use>
        </svg>
        <span className="text-light-grey">Exchange</span>
      </Link>
    </Menu.Item>
    <Menu.Item key="11" onClick={() => changeLanguage('korean')}>
      <Link to="/preemptive"
            className={"nav__dropdown-item " + (pathname === '/preemptive' ? 'nav__item--choosing' : '')}>
        <svg className="nav__icon">
          <use xlinkHref="../../../assets/images/sprite.svg#icon-preemptive"></use>
        </svg>
        <span className="text-light-grey">Preemptive</span>
      </Link>
    </Menu.Item>
    <SubMenu title={CurrentLanguage} placement="bottomRight">
      {languageItem}
    </SubMenu>
  </Menu>

  return (
    <Row className="header">
      <Col lg={{span: 2}}
           xs={{span: 12}}
           className="header-logo">
        <span>
          <img src="../../../assets/images/nextyplat.svg" className="header-logo--image" alt=""/>
        </span>
      </Col>
      <Col lg={{span: 12, order: 2}}
           xxl={{span: 10, order: 2}}
           xs={{span: 24, order: 3}}>
        <Row className="header-info">
          <Col lg={4} xs={6}>
            <p className="hide-on-mobile">last price</p>
            <p>${cutFloat(ntyQuote.price * Math.pow(10, 6), 5)}</p>
          </Col>
          <Col lg={4} xs={18}>
            <p className="balance text-green">${cutFloat(weiToNTY(balance * ntyQuote.price), 7)}</p>
          </Col>
          <Col lg={4} xs={12}>
            <p className="hide-on-mobile text-white">24h Change</p>
            <Row>
              <Col xs={12}>{cutFloat(ntyQuote.percent_change_24h, 4)}</Col>
              <Col xs={12}>-1.69</Col>
            </Row>
          </Col>
          <Col lg={4} xs={{span: 12, order: 4}}>
            <p className="hide-on-mobile">24h high</p>
            <Row>
              <Col xs={{span: 6, offset: 6}} className="hide-on-desktop">high</Col>
              <Col>0.024844</Col>
            </Row>
          </Col>
          <Col lg={4} xs={{span: 12, order: 2}}>
            <p className="hide-on-mobile">24h Low</p>
            <Row>
              <Col xs={{span: 6, offset: 6}} className="hide-on-desktop">Low</Col>
              <Col span={12}>0.0226174</Col>
            </Row>
          </Col>
          <Col lg={4} xs={{span: 12, order: 3}}>
            <p className="hide-on-mobile">24h volume</p>
            <p>Vol {cutFloat(ntyQuote.volume_24h, 2)}</p>
          </Col>
        </Row>
      </Col>
      <Col lg={{span: 0}}
           xs={{span: 12}}
           className="nav__dropdown"
      >
        <span>
          <Dropdown overlay={MenuOnMobile} trigger={['click']}>
            <div className="nav__dropdown-current">
              {pathname === '/exchange' ?
                <React.Fragment>
                  <svg className="nav__icon nav__dropdown-current-icon">
                    <use xlinkHref="../../../assets/images/sprite.svg#icon-exchange"></use>
                  </svg>
                  <span className="nav__dropdown-current-text">Exchange</span>
                </React.Fragment>
                :
                <React.Fragment>
                  <svg className="nav__icon nav__dropdown-current-icon">
                    <use xlinkHref="../../../assets/images/sprite.svg#icon-preemptive"></use>
                  </svg>
                  <span className="nav__dropdown-current-text">Preemptive</span>
                </React.Fragment>
              }
              <svg className="nav__icon nav__dropdown-icon">
                <use xlinkHref="../../../assets/images/sprite.svg#icon-drop-nav"></use>
              </svg>
            </div>
          </Dropdown>
          </span>
      </Col>
      <Col lg={{span: 10, order: 3}}
           xxl={{span: 12, order: 3}}
           xs={{span: 12, order: 2}}
           className="nav"
      >
        <div className="nav-box">
          <span
            className={"nav__exchange nav__item nav__item-exchange " + (pathname === '/exchange' ? 'nav__item--choosing' : '')}>
            <Link to="/exchange" className="vertical-center-item">
              <svg className="nav__icon">
                <use xlinkHref="../../../assets/images/sprite.svg#icon-exchange"></use>
              </svg>
              Exchange
            </Link>
          </span>
          <span
            className={"nav__preemptive nav__item nav__item-preemptive " + (pathname === '/preemptive' ? 'nav__item--choosing' : '')}>
            <Link to="/preemptive" className="vertical-center-item">
              <svg className="nav__icon">
                <use xlinkHref="../../../assets/images/sprite.svg#icon-preemptive"></use>
              </svg>
              Preemptive
            </Link>
          </span>
          <span className="nav__menu nav__item nav__item-language">
            <Dropdown overlay={LanguageSetting} trigger={['click']}>
              <a className='ant-dropdown-link vertical-center-item' style={{color: '#6e7793'}}
                 onClick={e => e.preventDefault()}>
                <svg className="nav__icon">
                  <use xlinkHref="../../../assets/images/sprite.svg#icon-language"></use>
                </svg>
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