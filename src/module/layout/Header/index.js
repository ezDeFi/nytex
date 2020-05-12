import React, {useState, useEffect} from 'react'
import {Menu, Dropdown, Row, Col}   from 'antd'
import {Link}                       from "react-router-dom";
import {useLocation}                from 'react-router-dom'
import {cutFloat}                   from '@/util/help.js'
import {useSelector}                from "react-redux";
import "antd/dist/antd.css";
import './style.scss'
import ApiService                   from "../../../service/ApiService";
import I18N                         from '@/I18N'
import {mul, weiToMNTY}                  from "../../../util/help";

const Header = () => {
  const apiService              = new ApiService()
  const [language, setLanguage] = useState('en')
  const ntyQuote                = useSelector(state => state.common.ntyQuote)
  const balance                 = useSelector(state => state.user.balance)
  let pathname                  = useLocation().pathname;
  const {SubMenu}               = Menu
  const [mntyBalance, setMntyBalance] = useState(0);

  const changeLanguage = (langCode) => {
    detectLanguage(langCode)
    I18N.setLang(langCode)
  }

  useEffect(() => {
    detectLanguage(I18N.getLang())
    apiService.loadNtyQuote()
  }, [])

  useEffect(() => {
    setMntyBalance(weiToMNTY(balance))
  }, [balance])

  const detectLanguage = (code) => {
      switch(code) {
        case 'vn':
        setLanguage(I18N.get('vietnamese'));
        break;
        case 'en':
          setLanguage(I18N.get('english'));
          break;
        case 'kr':
          setLanguage(I18N.get('korean'));
          break;
        case 'cn':
          setLanguage(I18N.get('chinese'));
          break;
      }
  }

  const languageItem = [
    <Menu.Item key="0" onClick={() => changeLanguage('vn')}>
      <a href='#' className="text-white"> {I18N.get('vietnamese')}</a>
    </Menu.Item>,
    <Menu.Item key="1" onClick={() => changeLanguage('en')}>
      <a href='#' className="text-white">{I18N.get('english')}</a>
    </Menu.Item>,
    <Menu.Item key="2" onClick={() => changeLanguage('kr')}>
      <a href='#'>{I18N.get('korean')}</a>
    </Menu.Item>,
    <Menu.Item key="3" onClick={() => changeLanguage('cn')}>
      <a href='#'>{I18N.get('Chinese')}</a>
    </Menu.Item>,
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
        <span className="text-light-grey">{I18N.get('exchange')}</span>
      </Link>
    </Menu.Item>
    <Menu.Item key="11" onClick={() => changeLanguage('korean')}>
      <Link to="/preemptive"
            className={"nav__dropdown-item " + (pathname === '/preemptive' ? 'nav__item--choosing' : '')}>
        <svg className="nav__icon">
          <use xlinkHref="../../../assets/images/sprite.svg#icon-preemptive"></use>
        </svg>
        <span className="text-light-grey">{I18N.get('preemptive')}</span>
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
          <Link to="/exchange">
            <img src="../../../assets/images/nextyplat.svg" className="header-logo--image" alt=""/>
          </Link>
        </span>
      </Col>
      <Col lg={{span: 12, order: 2}}
           xxl={{span: 10, order: 2}}
           xs={{span: 24, order: 3}}>
        <Row className="header-info">
          <Col lg={4} xs={6}>
            <p className="hide-on-mobile">{I18N.get('last_price')}</p>
            <p>${cutFloat(ntyQuote.filled, 4)}</p>
          </Col>
          <Col lg={4} xs={18}>
            <p className="balance text-green">${cutFloat(mul(weiToMNTY(balance), ntyQuote.filled), 4)}</p>
          </Col>
          <Col lg={4} xs={12}>
            <p className="hide-on-mobile text-white">{I18N.get('24h_change')}</p>
            <Row>
              <Col xs={12}>{cutFloat(ntyQuote.change, 4)}</Col>
              <Col xs={12}>-1.69</Col>
            </Row>
          </Col>
          <Col lg={4} xs={{span: 12, order: 4}}>
            <p className="hide-on-mobile">{I18N.get('24h_high')}</p>
            <Row>
              <Col xs={{span: 6, offset: 6}} className="hide-on-desktop">{I18N.get('high')}</Col>
              <Col>{cutFloat(ntyQuote.high, 6)}</Col>
            </Row>
          </Col>
          <Col lg={4} xs={{span: 12, order: 2}}>
            <p className="hide-on-mobile">{I18N.get('24h_low')}</p>
            <Row>
              <Col xs={{span: 6, offset: 6}} className="hide-on-desktop">{I18N.get('low')}</Col>
              <Col>{cutFloat(ntyQuote.low, 6)}</Col>
            </Row>
          </Col>
          <Col lg={4} xs={{span: 12, order: 3}}>
            <p className="hide-on-mobile">{I18N.get('24h_volume')}</p>
            <p>Vol {cutFloat(ntyQuote.volumeNewSD, 2)}</p>
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
                  <span className="nav__dropdown-current-text">{I18N.get('exchange')}</span>
                </React.Fragment>
                :
                <React.Fragment>
                  <svg className="nav__icon nav__dropdown-current-icon">
                    <use xlinkHref="../../../assets/images/sprite.svg#icon-preemptive"></use>
                  </svg>
                  <span className="nav__dropdown-current-text">{I18N.get('preemptive')}</span>
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
              {I18N.get('exchange')}
            </Link>
          </span>
          <span
            className={"nav__preemptive nav__item nav__item-preemptive " + (pathname === '/preemptive' ? 'nav__item--choosing' : '')}>
            <Link to="/preemptive" className="vertical-center-item">
              <svg className="nav__icon">
                <use xlinkHref="../../../assets/images/sprite.svg#icon-preemptive"></use>
              </svg>
              {I18N.get('preemptive')}
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