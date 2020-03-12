import React from 'react';
import {Row, Col, Input} from 'antd'

const Index = () => {

  return (
    <>
      <Row>
        <Col span={12}>
          <p> Buy ETH</p>
          <Row>
            <Col span={6}><label htmlFor="">Price</label></Col>
            <Col span={18}>
              <Input suffix="BTC"/>
            </Col>
          </Row>
          <Row>
            <Col span={6}><label htmlFor="">Amount</label></Col>
            <Col span={18}><Input suffix="ETH"/></Col>
          </Row>
          <Row>
            <Col span={6}><label htmlFor="">Total</label></Col>
            <Col span={18}><Input suffix="BTC"/></Col>
          </Row>
          <button>Buy</button>
        </Col>
        <Col span={12}>
          <p> Buy ETH</p>
          <Row>
            <Col span={6}><label htmlFor="">Price</label></Col>
            <Col span={18}>
              <Input suffix="BTC"/>
            </Col>
          </Row>
          <Row>
            <Col span={6}><label htmlFor="">Amount</label></Col>
            <Col span={18}><Input suffix="ETH"/></Col>
          </Row>
          <Row>
            <Col span={6}><label htmlFor="">Total</label></Col>
            <Col span={18}><Input suffix="BTC"/></Col>
          </Row>
          <button>Buy</button>
        </Col>
      </Row>
    </>
  )
}

export default Index