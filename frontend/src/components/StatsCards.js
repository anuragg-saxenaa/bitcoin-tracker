import React from 'react';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

const StatsCards = ({ currentPrice }) => {
  if (!currentPrice) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const formatVolume = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const stats = [
    {
      title: 'Market Cap',
      value: formatCurrency(currentPrice.marketCap),
      icon: DollarSign,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: '24h Volume',
      value: formatVolume(currentPrice.volume24h),
      icon: BarChart3,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: '24h Change',
      value: `${currentPrice.change24h >= 0 ? '+' : ''}${currentPrice.change24h.toFixed(2)}%`,
      icon: TrendingUp,
      color: currentPrice.change24h >= 0 
        ? 'text-green-600 dark:text-green-400' 
        : 'text-red-600 dark:text-red-400',
      bgColor: currentPrice.change24h >= 0 
        ? 'bg-green-100 dark:bg-green-900' 
        : 'bg-red-100 dark:bg-red-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className={`text-2xl font-bold mt-2 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-full`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards; 