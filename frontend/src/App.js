import React, { useState, useEffect } from 'react';
import { Moon, Sun, DollarSign, BarChart3 } from 'lucide-react';
import BitcoinPrice from './components/BitcoinPrice';
import PriceChart from './components/PriceChart';
import StatsCards from './components/StatsCards';
import { bitcoinService } from './services/bitcoinService';
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Fetch initial data
    fetchInitialData();

    // Connect to WebSocket
    bitcoinService.connect(
      (price) => {
        setCurrentPrice(price);
        setConnected(true);
      },
      () => setConnected(false)
    );

    return () => {
      bitcoinService.disconnect();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [price, history] = await Promise.all([
        bitcoinService.getCurrentPrice(),
        bitcoinService.getPriceHistory(24)
      ]);
      setCurrentPrice(price);
      setPriceHistory(history);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const refreshData = () => {
    fetchInitialData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bitcoin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-bitcoin rounded-full p-3">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">Bitcoin Tracker</h1>
                <p className="text-gray-600 dark:text-gray-400">Real-time Bitcoin price monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {connected ? 'Live' : 'Disconnected'}
                </span>
              </div>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {/* Refresh Button */}
              <button
                onClick={refreshData}
                className="btn-primary flex items-center space-x-2"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Current Price */}
          <div className="lg:col-span-1">
            <BitcoinPrice currentPrice={currentPrice} />
          </div>
          
          {/* Middle Column - Stats Cards */}
          <div className="lg:col-span-2">
            <StatsCards currentPrice={currentPrice} />
          </div>
        </div>
        
        {/* Price Chart */}
        <div className="mt-8">
          <PriceChart priceHistory={priceHistory} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>Bitcoin Tracker - Real-time cryptocurrency price monitoring</p>
            <p className="mt-2 text-sm">Data provided by CoinGecko API</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 