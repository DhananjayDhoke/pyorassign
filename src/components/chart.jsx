
import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import axios from 'axios';

const EChartsComponent = () => {
  const chartRef = useRef(null);
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  console.log(data);

  useEffect(() => {
    if (text) {
      getData(text)
        .then((fetchedData) => {
          setData(fetchedData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [text]);

  useEffect(() => {
    if (data.length > 0) {
      const chartDom = chartRef.current;
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: 'Dynamic Data & Time Axis',
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0];
            var date = new Date(params.name);
            return (
              date.getDate() +
              '/' +
              (date.getMonth() + 1) +
              '/' +
              date.getFullYear() +
              ' : ' +
              params.value[1]
            );
          },
          axisPointer: {
            animation: false,
          },
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            name: 'Fake Data',
            type: 'line',
            showSymbol: false,
            data: data,
          },
        ],
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, [data]);

  async function getData(text) {
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${text}/market_chart?vs_currency=usd&days=365&interval=daily`
      );
      return res.data.prices;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  const coin = [
    { name: 'Ethereum', val: 'ethereum' },
    { name: 'Dogecoin', val: 'dogecoin' },
    { name: 'Solana', val: 'solana' },
  ];

  return (
    <>
      <div>
        <select
          name=""
          id=""
          onChange={(e) => {
            setText(e.target.value);
          }}
        >
          <option value="">Select coin</option>
          {coin.map((cdata) => (
            <option key={cdata.val} value={cdata.val}>
              {cdata.name}
            </option>
          ))}
        </select>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </>
  );
};

export default EChartsComponent;
