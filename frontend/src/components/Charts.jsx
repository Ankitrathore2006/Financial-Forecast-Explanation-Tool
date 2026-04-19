import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Charts = ({ data, stockName }) => {
  if (!data || !data.dates || !data.prices) return null;

  const chartData = {
    labels: data.dates,
    datasets: [
      {
        type: 'line',
        label: `${stockName} Price`,
        data: data.prices,
        borderColor: '#adc6ff',
        backgroundColor: 'rgba(173, 198, 255, 0.05)',
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#adc6ff',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      ...(data.volumes ? [{
        type: 'bar',
        label: 'Volume',
        data: data.volumes,
        backgroundColor: 'rgba(139, 144, 160, 0.1)',
        hoverBackgroundColor: 'rgba(173, 198, 255, 0.2)',
        yAxisID: 'y1',
        barPercentage: 0.6,
        borderRadius: 4,
      }] : [])
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1d2023',
        titleColor: '#adc6ff',
        titleFont: { family: 'Manrope', size: 12, weight: 'bold' },
        bodyColor: '#e1e2e7',
        bodyFont: { family: 'Inter', size: 12 },
        borderColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        padding: 16,
        cornerRadius: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#8b90a0',
          maxTicksLimit: 6,
          font: { family: 'Inter', size: 10, weight: '600' }
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: {
          color: '#8b90a0',
          font: { family: 'Inter', size: 10, weight: '600' },
          callback: (value) => '$' + value.toLocaleString()
        },
      },
      ...(data.volumes ? {
        y1: {
            type: 'linear',
            display: false,
            position: 'right',
            min: 0,
            suggestedMax: Math.max(...data.volumes) * 4
        }
      } : {})
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="glass-panel p-8 rounded-xl w-full border border-white/5 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-headline font-black text-xl text-on-surface tracking-tighter">Price Dynamics</h3>
          <p className="text-xs font-bold text-outline uppercase tracking-[0.2em] mt-1">Real-time Data Stream: {stockName}</p>
        </div>
        <div className="flex gap-4">
            <span className="flex items-center gap-2 text-[10px] font-black text-outline uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#adc6ff] shadow-[0_0_10px_#adc6ff]"></span> Price
            </span>
            {data.volumes && (
                <span className="flex items-center gap-2 text-[10px] font-black text-outline uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-sm bg-[#8b90a0]/30"></span> Volume
                </span>
            )}
        </div>
      </div>
      <div className="relative h-[400px] w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Charts;
