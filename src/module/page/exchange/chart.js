import React, {useEffect, useRef, useState} from 'react';
import {createChart, CrosshairMode}         from 'lightweight-charts';
import ApiService                           from "../../../service/ApiService";
import {Col}                                from "antd";
// import {priceData} from './priceData'

const Index = (props) => {
  const apiService = new ApiService()
  const [priceData, setPriceData] = useState([])
  const chartContainerRef = useRef();
  const chart = useRef();
  const resizeObserver = useRef();
  const [candleType, setCandleType] = useState(localStorage.getItem('candle_type') ? localStorage.getItem('candle_type') : '15m')


  useEffect(() => {
    renderChart(candleType)
  }, [priceData]);

  // Resize chart on container resizes.
  useEffect(() => {
    resizeObserver.current = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({ width, height });
      setTimeout(() => {
        chart.current.timeScale().fitContent();
      }, 0);
    });

    resizeObserver.current.observe(chartContainerRef.current);

    return () => resizeObserver.current.disconnect();
  }, []);

  const selectCandleType = async (type) => {
    localStorage.setItem('candle_type', type)
    setCandleType(type)
    chart.current.remove()
    renderChart(type)
  }

  const renderChart = (type) => {
    chart.current = createChart(chartContainerRef.current, {
      width     : chartContainerRef.current.clientWidth,
      height    : chartContainerRef.current.clientHeight,
      layout    : {
        backgroundColor: '#252C3F',
        textColor      : 'rgba(255, 255, 255, 0.9)',
      },
      grid      : {
        vertLines: {
          color: '#334158',
        },
        horzLines: {
          color: '#334158',
        },
      },
      crosshair : {
        mode: CrosshairMode.Normal,
      },
      priceScale: {
        borderColor: '#485c7b',
      },
      timeScale : {
        timeVisible   : true,
        secondsVisible: false,
        // borderColor   : '#485c7b',
      },
    });

    const candleSeries = chart.current.addCandlestickSeries({
      upColor        : '#4bffb5',
      downColor      : '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor  : '#4bffb5',
      wickDownColor  : '#838ca1',
      wickUpColor    : '#838ca1',
    });

    const volumeSeries = chart.current.addHistogramSeries({
      color: '#182233',
      lineWidth: 2,
      priceFormat: {
        type: 'volume',
      },
      overlay: true,
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    //
    apiService.loadHistoricalData((data) => candleSeries.setData(data), (data) => volumeSeries.setData(data), type)

    // volumeSeries.setData(volumeData);
  }

  return (
    <div className="chart">
      <div className="chart__content" id="chart-content">
        <div className="chart-header">
          <button className={"chart__button-candle " + (candleType === '15m'? "chart__button-candle--choosing": '')} onClick={() => selectCandleType('15m')}>15M</button>
          <button className={"chart__button-candle " + (candleType === '1h'? "chart__button-candle--choosing": '')} onClick={() => selectCandleType('1h')}>1H</button>
          <button className={"chart__button-candle " + (candleType === '1d'? "chart__button-candle--choosing": '')} onClick={() => selectCandleType('1d')}>1D</button>
        </div>
        <div ref={chartContainerRef} className="chart-container"></div>
      </div>
    </div>
  )
}

export default Index