import React from 'react';
import BaseComponent from '@/model/BaseComponent';
import { Col, Row, Avatar } from 'antd'
import I18N from '@/I18N'

import './style.scss'

export default class extends BaseComponent {
    ord_render() {
        return (
            <div className="c_Footer">
                <div className="footer-box">
                    <div className="text-copyright">2019 TheBet. All Rights Reserved</div>
                    <Row className="d_rowFooter d_footerSection">
                        <Col className="contact-container text-center" xs={24} sm={24} md={5}>
                            <img className="logo_own" src="/assets/images/footer-logo.png"/>
                        </Col>
                        <Col className="contact-container" xs={12} sm={12} md={5}>
                            <div className="links footer-vertical-section">
                                <div className="title brand-color">
                                    Support
                                </div>
                                <div className="footer-color-dark"><a href="/vision" target="_blank">{I18N.get('vision.00')}</a></div>
                                <div className="footer-color-dark"><a href="#">{I18N.get('landing.footer.wallet')}</a></div>
                            </div>
                        </Col>
                        <Col className="contact-container" xs={12} sm={12} md={7}>
                            <div className="contact footer-vertical-section">
                                <div className="title brand-color">
                                    Community
                                </div>
                                <div className="footer-color-dark">{I18N.get('landing.cr')}: <a href="mailto:shidadata@gmail.com">shidadata@gmail.com</a></div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={7}>
                            <div className="join footer-vertical-section">
                                <div className="title brand-color">
                                    Join Us On
                                </div>
                                <div className="social-icons">
                                    <a href="#" target="_blank"><i className="fab fa-telegram fa-2x"/></a>
                                    <a href="#" target="_blank"><i className="fab fa-github fa-2x"/></a>
                                    <a href="#" target="_blank"><i className="fab fa-discord fa-2x"/></a>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
