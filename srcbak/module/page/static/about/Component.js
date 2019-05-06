import React from 'react'
import StandardPage from '../../StandardPage'
import Footer from '@/module/layout/Footer/Container'
import './style.scss'

import { Col, Row, Icon, Form, Input, Button, Modal, Select, Table, List, Tooltip, Breadcrumb, Card } from 'antd'
import moment from 'moment/moment'

export default class extends StandardPage {

    ord_renderContent () {
        return (
            <div className="p_About">
                <div className="ebp-header-divider">

                </div>

                <div className="ebp-page-title">
                    <Row className="d_row d_rowGrey">
                        <h3 className="page-header">
                            About & Guide
                        </h3>
                    </Row>
                </div>
                <div className="ebp-page">
                    <Row className="d_row">
                        <span dangerouslySetInnerHTML={{__html : `<p style="text-align: justify;"><span style="font-weight: 400;">...</span></p>`}}></span>
                        <a href="" target="_blank">Read code smart contract</a><br />
                        <img src="/assets/images/deposit.png" style={{width: '100%', maxWidth: '550px'}}/>

                        <span dangerouslySetInnerHTML={{__html : `
                        <p style="text-align: justify;"><span style="font-weight: 400;"></span></p>`}}></span>
                        <a href="" target="_blank">Read code smart contract</a><br />
                        <img src="/assets/images/random.png" style={{width: '100%', maxWidth: '550px'}}/>

                        <span dangerouslySetInnerHTML={{__html : ``
                        }}></span>
                    </Row>
                </div>
                <Footer/>
            </div>
        )
    }
}
