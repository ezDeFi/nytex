import React from 'react';
import {Row, Col, Input} from 'antd'
import BtnOval from '../../Component/ButtonOval'

const Index = () => {

  return [
    <Row key={'buy-sale' + 0}>
      <Col lg={12} xs={24} className='trade__sub-box trade__buy-box'>
        <p className="trade__sub-box--title"> Buy ETH</p>
        <Row className="trade__sub-box--field-buy">
          <Col span={6}><label htmlFor="">Price</label></Col>
          <Col span={16} offset={2}>
            <Input suffix="BTC"/>
          </Col>
        </Row>
        <Row className="trade__sub-box--field-amount">
          <Col span={6}><label htmlFor="">Amount</label></Col>
          <Col span={16} offset={2}><Input suffix="ETH"/></Col>
        </Row>
        <Row>
        </Row>
        <Row className="trade__sub-box--field-total">
          <Col span={6}><label htmlFor="">Total</label></Col>
          <Col span={16} offset={2}>
            <div className='list-btn-choose-amount'>
              <BtnOval>25%</BtnOval>
              <BtnOval>50%</BtnOval>
              <BtnOval>75%</BtnOval>
              <BtnOval>100%</BtnOval>
            </div>
            <div>
              <Input suffix="BTC"/>
            </div>
          </Col>
        </Row>
        <Row>
          <button className="btn-buy-currency">Buy</button>
        </Row>
      </Col>
      <Col lg={12} xs={24} className='trade__sub-box trade__sale-box'>
        <p className="trade__sub-box--title"> Buy ETH</p>
        <Row className="trade__sub-box--field-buy">
          <Col span={6}><label htmlFor="">Price</label></Col>
          <Col span={16} offset={2}>
            <Input suffix="BTC"/>
          </Col>
        </Row>
        <Row className="trade__sub-box--field-amount">
          <Col span={6}><label htmlFor="">Amount</label></Col>
          <Col  span={16} offset={2}><Input suffix="ETH"/></Col>
        </Row>
        <Row>
        </Row>
        <Row className="trade__sub-box--field-total">
          <Col span={6}><label htmlFor="">Total</label></Col>
          <Col  span={16} offset={2}>
            <div className='list-btn-choose-amount'>
              <BtnOval>25%</BtnOval>
              <BtnOval>50%</BtnOval>
              <BtnOval>75%</BtnOval>
              <BtnOval>100%</BtnOval>
            </div>
            <div>
              <Input suffix="BTC"/>
            </div>
          </Col>
        </Row>
        <Row>
          <button className="btn-sale-currency">Sale</button>
        </Row>
      </Col>
    </Row>
  ]
}

export default Index