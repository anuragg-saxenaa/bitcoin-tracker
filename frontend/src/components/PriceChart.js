import React, { useRef, useMemo, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart = ({ priceHistory }) => {
  const chartRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect theme changes efficiently
  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Initial theme detection
    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Price History (24h)
          </h2>
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Memoize chart data to avoid recreating on every render
  const chartData = useMemo(() => ({
    labels: priceHistory.map(price => 
      new Date(price.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    ),
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: priceHistory.map(price => parseFloat(price.price)),
        borderColor: '#f7931a',
        backgroundColor: 'rgba(247, 147, 26, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f7931a',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }), [priceHistory]);

  // Memoize chart options to avoid recreating when theme hasn't changed
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#e5e7eb' : '#374151',
        bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          callback: function(value) {
            return '$' + value.toLocaleString('en-US');
          },
        },
      },
    },
  }), [isDarkMode]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Price History (24h)
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {priceHistory.length} data points
        </div>
      </div>
      <div className="h-96">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PriceChart; 