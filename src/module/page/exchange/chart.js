import React, {useEffect, useRef} from 'react';
import {createChart, CrosshairMode}         from 'lightweight-charts';
import ApiService                           from "../../../service/ApiService";
import {useSelector}      from "react-redux";

const Index = (props) => {
  const apiService = new ApiService()
  const chartRef = useRef(null);

  useEffect(() => {
    apiService.loadHistoricalData(function (data) {
      const chart        = createChart(chartRef.current, {
        width: 1000, height: 485, crosshair: {
          mode: CrosshairMode.Normal,
        },
      });
      const candleSeries = chart.addCandlestickSeries();
      candleSeries.setData(data);

      // resize when screen size is changed
      function updateSize() {
        if(chart) {
          chart.resize(document.getElementById('chart-content').clientWidth, document.getElementById('chart-content').clientHeight)
        }
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    })
  }, []);

  return (
    <div className="">
      <div ref={chartRef}></div>
    </div>
  )
}

export default Index