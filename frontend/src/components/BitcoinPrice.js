import React from 'react';
import { TrendingUp, TrendingDown, Bitcoin } from 'lucide-react';

const BitcoinPrice = ({ currentPrice }) => {
  if (!currentPrice) {
    return (
      <div className="card animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  const isPositive = currentPrice.change24h >= 0;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(currentPrice.price);

  const formattedChange = Math.abs(currentPrice.change24h).toFixed(2);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Current Price
        </h2>
        <div className="bg-bitcoin rounded-full p-2">
          <Bitcoin className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {formattedPrice}
          </div>
          
          <div className={`flex items-center space-x-2 ${
            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            <span className="font-semibold">
              {isPositive ? '+' : '-'}{formattedChange}%
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              24h change
            </span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date(currentPrice.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinPrice; 