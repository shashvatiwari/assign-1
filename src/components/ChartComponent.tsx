import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import 'chartjs-adapter-date-fns'; 
import { useWebSocket } from "./WebSocketProvider";
import './ChartComponent.css'; 

ChartJS.register(LineElement, CategoryScale, TimeScale, LinearScale, PointElement, Tooltip, Legend);

interface ChartProps {
  symbol: string; 
  interval: string; 
}

const ChartComponent: React.FC<ChartProps> = ({ symbol, interval }) => {
  const { data, subscribe } = useWebSocket();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const ws = subscribe(symbol, interval); 

    return () => {
      if (ws) {
        ws.close(); 
      }
    };
  }, [symbol, interval, subscribe]);

  useEffect(() => {
    const upperSymbol = symbol.toUpperCase();
    if (data[upperSymbol]) {
      const updatedChartData = data[upperSymbol].map((candle: any) => ({
        t: new Date(candle.t).toLocaleTimeString('en-GB', { hour12: false }),
        o: parseFloat(candle.o),
        h: parseFloat(candle.h),
        l: parseFloat(candle.l),
        c: parseFloat(candle.c),
      }));
      console.log(`Updated Chart Data for ${upperSymbol}:`, updatedChartData);
      setChartData(updatedChartData);
    } else {
      console.warn(`No data found for symbol: ${upperSymbol}`);
    }
  }, [data, symbol]);

  useEffect(() => {
    console.log("Available symbols in data:", Object.keys(data));
  }, [data]);

  if (chartData.length === 0) {
    return <div className="chart-message">No data available yet. Please check your connection or selected coin.</div>;
  }

  const chartConfig = {
    labels: chartData.map((d) => d.t),
    datasets: [
      {
        label: `${symbol} - ${interval}`,
        data: chartData.map((d) => d.c),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        pointRadius: 0,
        tension: 0.1,
      },
    ],
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
        },
        tooltip: {
          enabled: true,
          mode: 'index' as const,
          intersect: false,
        },
      },
      scales: {
        x: {
            type: 'time',
            time: {
              unit: 'second',
            },
          title: {
            display: true,
            text: 'Time',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Price (USDT)',
          },
          beginAtZero: false,
        },
      },
      interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false,
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="chart-title">{symbol.toUpperCase()} Candlestick Chart</h2>
      </div>
      <Line data={chartConfig} />
      <div className="chart-legend">
        <span>Latest Close Price: {chartData[chartData.length - 1]?.c}</span>
      </div>
    </div>
  );
};

export default ChartComponent;
