import React from 'react';
import {Row, Col, Input} from 'antd'

const Index = () => {

  return [
    <Row key={'buy-sale' + 0}>
      <Col lg={12} xs={24} className='trade__sub-box trade__buy-box'>
        <p className="trade__sub-box--title"> Buy ETH</p>
        <Row className="trade__sub-box--field-buy">
          <Col span={6}><label htmlFor="">Price</label></Col>
          <Col span={18}>
            <Input suffix="BTC"/>
          </Col>
        </Row>
        <Row className="trade__sub-box--field-amount">
          <Col span={6}><label htmlFor="">Amount</label></Col>
          <Col span={18}><Input suffix="ETH"/></Col>
        </Row>
        <Row>
        </Row>
        <Row className="trade__sub-box--field-total">
          <Col span={6}><label htmlFor="">Total</label></Col>
          <Col span={18}>
            <Row>
              <Col span={6} className="text-align--left">15%</Col>
              <Col span={6} className="text-align--center">15%</Col>
              <Col span={6} className="text-align--center">15%</Col>
              <Col span={6} className="text-align--right">15%</Col>
              <Col span={24}>
                <Input suffix="BTC"/>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col lg={12} xs={24} className='trade__sub-box trade__sale-box'>
        <p className="trade__sub-box--title"> Buy ETH</p>
        <Row className="trade__sub-box--field-buy">
          <Col span={6}><label htmlFor="">Price</label></Col>
          <Col span={18}>
            <Input suffix="BTC"/>
          </Col>
        </Row>
        <Row className="trade__sub-box--field-amount">
          <Col span={6}><label htmlFor="">Amount</label></Col>
          <Col span={18}><Input suffix="ETH"/></Col>
        </Row>
        <Row>
        </Row>
        <Row className="trade__sub-box--field-total">
          <Col span={6}><label htmlFor="">Total</label></Col>
          <Col span={18}>
            <Row>
              <Col span={6} className="text-align--left">15%</Col>
              <Col span={6} className="text-align--center">15%</Col>
              <Col span={6} className="text-align--center">15%</Col>
              <Col span={6} className="text-align--right">15%</Col>
              <Col span={24}>
                <Input suffix="BTC"/>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>,
    <Row key={'buy-sale' + 1}>
      <Col span={12}>
        <button className="btn-buy-currency">Buy</button>
      </Col>
      <Col span={12}>
        <button className="btn-sale-currency">Sale</button>
      </Col>
    </Row>
  ]
}

export default Index