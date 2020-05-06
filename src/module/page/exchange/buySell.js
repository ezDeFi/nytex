import React, {useState}                                                      from 'react';
import {Row, Col, Input, Modal}                                               from 'antd'
import BtnOval                                                                from '../../Component/ButtonOval'
import {useSelector, useDispatch}                                   from "react-redux";
import store                                                                  from "../../../store";
import {thousands, weiToMNTY, weiToNUSD, mntyToWei, nusdToWei, mul} from '@/util/help.js'

const Index = (props) => {
  let stableTokenBalance            = useSelector(state => state.user.stableTokenBalance)
  let balance                       = useSelector(state => state.user.balance)
  let priceToSell                   = useSelector(state => state.exchange.priceToSell)
  let priceToBuy                    = useSelector(state => state.exchange.priceToBuy)
  let dispatch                      = useDispatch()
  const exchangeAction              = store.getRedux('exchange').actions;
  const [amountBuy, setAmountBuy]   = useState(0)
  const [amountSell, setAmountSell] = useState(0)
  const [totalBuy, setTotalBuy] = useState(0)


  const setAmountToBuy = (persent) => {
    let newTotal = weiToNUSD(stableTokenBalance) * persent / 100;
    setTotalBuy(newTotal)
    if(priceToBuy) {
      setAmountBuy(newTotal / priceToBuy)
    }
  }

  const setAmountToSell = (persent) => {
    setAmountSell(weiToMNTY(balance) * persent / 100)
  }

  const buyVolatileToken = () => {
    try {
      let wantAmount, wantWei, haveWei
      try {
        wantAmount = amountBuy.toString().trim()
        wantWei = mntyToWei(wantAmount);
        BigInt(wantWei)
      } catch (e) {
        console.error(e)
        throw 'invalid amount'
      }
      try {
        console.log(wantAmount, priceToBuy)
        const haveAmount = mul(wantAmount, priceToBuy);
        haveWei = nusdToWei(haveAmount);
      } catch (e) {
        console.error(e)
        throw 'invalid price'
      }
      if (haveWei === '0') {
        throw "amount or price too small"
      }
      console.log('*** have USD: ', thousands(haveWei))
      console.log('*** want NTY: ', thousands(wantWei))
      props.buyVolatileToken(haveWei, wantWei)
    } catch (e) {
      console.log("------------error---------")
      if (typeof e === 'string') {
        Modal.error({
          title: 'New Buy Order',
          content: e,
          maskClosable: true,
        })
      } else {
        console.error(e)
        Modal.error({
          title: 'New Buy Order',
          content: 'unable to create buy order',
          maskClosable: true,
        })
      }
    }
  }

  const sellVolatileToken = () => {
    try {
      let haveAmount, haveWei, wantWei
      try {
        haveAmount = amountSell.toString().trim()
        haveWei    = mntyToWei(haveAmount);
        BigInt(haveWei)
      } catch (e) {
        console.error(e)
        throw 'invalid amount'
      }
      try {
        const wantAmount = mul(haveAmount, priceToSell);
        wantWei          = nusdToWei(wantAmount);
      } catch (e) {
        console.log(e)
        throw 'invalid price'
      }
      if (wantWei === '0') {
        throw "amount or price too small"
      }
      console.log('*** have NTY: ', thousands(haveWei))
      console.log('*** want USD: ', thousands(wantWei))

      props.sellVolatileToken(haveWei, wantWei)
    } catch (e) {
      if (typeof e === 'string') {
        Modal.error({
          title       : 'New Sell Order',
          content     : e,
          maskClosable: true,
        })
      } else {
        console.error(e)
        Modal.error({
          title       : 'New Sell Order',
          content     : 'unable to create sell order',
          maskClosable: true,
        })
      }
    }
  }

  return (
    <div className="trade-box__content">
      <Row key={'buy-sell' + 0}>
        <Col lg={12} xs={24} className='trade__sub-box trade__buy-box'>
          <p className="trade__sub-box--title"> Buy MNTY</p>
          <Row className="trade__sub-box--field-buy">
            <Col span={6}><label htmlFor="">Price</label></Col>
            <Col span={16} offset={2}>
              <Input
                suffix="NUSD"
                value={priceToBuy}
                onChange={e => {
                  dispatch(exchangeAction.priceToBuy_update(e.target.value))
                  setTotalBuy(mul(e.target.value, amountBuy))
                }}
              />
            </Col>
          </Row>
          <Row className="trade__sub-box--field-amount">
            <Col span={6}><label htmlFor="">Amount</label></Col>
            <Col span={16} offset={2}>
              <Input
                suffix="MNTY"
                value={amountBuy}
                onChange={e => {
                  setAmountBuy(e.target.value)
                  setTotalBuy(mul(e.target.value, priceToBuy))
                  // setTotalBuy(e.target.value * priceToBuy)
                }}/>
            </Col>
          </Row>
          <Row>
          </Row>
          <Row className="trade__sub-box--field-total">
            <Col span={6}><label htmlFor="">Total</label></Col>
            <Col span={16} offset={2}>
              <div className='list-btn-choose-amount'>
                <BtnOval onClick={() => setAmountToBuy(25)}>25%</BtnOval>
                <BtnOval onClick={() => setAmountToBuy(50)}>50%</BtnOval>
                <BtnOval onClick={() => setAmountToBuy(75)}>75%</BtnOval>
                <BtnOval onClick={() => setAmountToBuy(100)}>100%</BtnOval>
              </div>
              <div>
                <Input
                  suffix="NUSD"
                  value={totalBuy}
                  onChange={e => {
                    setTotalBuy(e.target.value)
                    if(priceToBuy) {
                      setAmountBuy(e.target.value / priceToBuy)
                    }
                  }}/>
              </div>
            </Col>
          </Row>
          <Row>
            <button
              className="btn-buy-currency"
              onClick={buyVolatileToken}
            >
              Buy
            </button>
          </Row>
        </Col>
        <Col lg={12} xs={24} className='trade__sub-box trade__sell-box'>
          <p className="trade__sub-box--title"> SELL MNTY</p>
          <Row className="trade__sub-box--field-buy">
            <Col span={6}><label htmlFor="">Price</label></Col>
            <Col span={16} offset={2}>
              <Input
                suffix="NUSD"
                value={priceToSell}
                onChange={e => dispatch(exchangeAction.priceToSell_update(e.target.value))}
              />
            </Col>
          </Row>
          <Row className="trade__sub-box--field-amount">
            <Col span={6}><label htmlFor="">Amount</label></Col>
            <Col span={16} offset={2}>
              <Input
                suffix="MNTY"
                value={amountSell}
                onChange={e => {
                  // if (e.target.value < weiToMNTY(balance) && !isNaN(e.target.value))
                    setAmountSell(e.target.value)
                }
                }
              />
            </Col>
          </Row>
          <Row>
          </Row>
          <Row className="trade__sub-box--field-total">
            <Col span={6}><label htmlFor="">Total</label></Col>
            <Col span={16} offset={2}>
              <div className='list-btn-choose-amount'>
                <BtnOval onClick={() => setAmountToSell(25)}>25%</BtnOval>
                <BtnOval onClick={() => setAmountToSell(50)}>50%</BtnOval>
                <BtnOval onClick={() => setAmountToSell(75)}>75%</BtnOval>
                <BtnOval onClick={() => setAmountToSell(100)}>100%</BtnOval>
              </div>
              <div>
                <Input
                  suffix="NUSD"
                  value={parseFloat(priceToSell) * parseFloat(amountSell)}
                  onChange={e => {
                    setAmountSell(e.target.value / priceToSell)
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <button
              className="btn-sell-currency"
              onClick={sellVolatileToken}
            >
              Sell
            </button>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default Index