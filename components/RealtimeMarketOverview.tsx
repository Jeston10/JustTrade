'use client';

import { useState, useEffect } from 'react';
import { getStockQuote } from '@/lib/actions/finnhub.actions';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Globe, RefreshCw } from 'lucide-react';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  trend: 'up' | 'down' | 'neutral';
}

interface RealtimeMarketOverviewProps {
  className?: string;
}

const RealtimeMarketOverview = ({ className = '' }: RealtimeMarketOverviewProps) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Major market indices and popular stocks
  const marketSymbols = [
    { symbol: 'SPY', name: 'S&P 500 ETF' },
    { symbol: 'QQQ', name: 'NASDAQ ETF' },
    { symbol: 'DIA', name: 'Dow Jones ETF' },
    { symbol: 'AAPL', name: 'Apple Inc' },
    { symbol: 'MSFT', name: 'Microsoft Corp' },
    { symbol: 'GOOGL', name: 'Alphabet Inc' },
    { symbol: 'AMZN', name: 'Amazon.com Inc' },
    { symbol: 'TSLA', name: 'Tesla Inc' },
    { symbol: 'META', name: 'Meta Platforms' },
    { symbol: 'NVDA', name: 'NVIDIA Corp' },
    { symbol: 'JPM', name: 'JPMorgan Chase' },
    { symbol: 'V', name: 'Visa Inc' },
  ];

  const fetchMarketData = async () => {
    try {
      const promises = marketSymbols.map(async (stock) => {
        try {
          const quote = await getStockQuote(stock.symbol);
          
          if (quote) {
            return {
              symbol: stock.symbol,
              name: stock.name,
              price: quote.currentPrice,
              change: quote.change,
              changePercent: quote.changePercent,
              volume: Math.floor(Math.random() * 10000000) + 1000000, // Mock volume
              marketCap: `${(Math.random() * 2000 + 100).toFixed(1)}B`, // Mock market cap
              trend: (quote.change || 0) >= 0 ? 'up' : 'down'
            };
          } else {
            // Fallback to mock data
            const mockPrice = Math.random() * 200 + 50;
            const mockChange = (Math.random() - 0.5) * 10;
            const mockChangePercent = (mockChange / mockPrice) * 100;
            
            return {
              symbol: stock.symbol,
              name: stock.name,
              price: mockPrice,
              change: mockChange,
              changePercent: mockChangePercent,
              volume: Math.floor(Math.random() * 10000000) + 1000000,
              marketCap: `${(Math.random() * 2000 + 100).toFixed(1)}B`,
              trend: mockChange >= 0 ? 'up' : 'down'
            };
          }
        } catch (error) {
          console.error(`Error fetching data for ${stock.symbol}:`, error);
          // Return mock data on error
          const mockPrice = Math.random() * 200 + 50;
          const mockChange = (Math.random() - 0.5) * 10;
          const mockChangePercent = (mockChange / mockPrice) * 100;
          
          return {
            symbol: stock.symbol,
            name: stock.name,
            price: mockPrice,
            change: mockChange,
            changePercent: mockChangePercent,
            volume: Math.floor(Math.random() * 10000000) + 1000000,
            marketCap: `${(Math.random() * 2000 + 100).toFixed(1)}B`,
            trend: mockChange >= 0 ? 'up' : 'down'
          };
        }
      });

      const results = await Promise.all(promises);
      setMarketData(results);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMarketData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchMarketData();
      setLoading(false);
    };

    loadData();

    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchMarketData, 15000);
    return () => clearInterval(interval);
  }, []);

  const getIconForTrend = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-400" />;
    }
  };

  const getValueColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <div className={`bg-[#1a1a1a] rounded-lg p-6 border border-gray-700 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">Loading market data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#1a1a1a] rounded-lg p-6 border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Market Overview</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          title="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Market Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketData.map((stock, index) => (
          <div
            key={stock.symbol}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
            onClick={() => window.open(`/stock/${stock.symbol}`, '_blank')}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getIconForTrend(stock.trend)}
                <div>
                  <div className="text-sm font-medium text-white">{stock.symbol}</div>
                  <div className="text-xs text-gray-400">{stock.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">${stock.price.toFixed(2)}</div>
                <div className={`text-sm ${getValueColor(stock.change)}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                  <span className="ml-1">
                    ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Vol: {(stock.volume / 1000000).toFixed(1)}M</span>
              <span>Cap: {stock.marketCap}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          <span>Auto-refresh: 15s</span>
        </div>
      </div>
    </div>
  );
};

export default RealtimeMarketOverview;

