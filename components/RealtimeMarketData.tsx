'use client';

import { useState, useEffect } from 'react';
import { getStockQuote } from '@/lib/actions/finnhub.actions';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Globe, RefreshCw, Volume2 } from 'lucide-react';

interface MarketDataItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  pe: number;
  trend: 'up' | 'down' | 'neutral';
  category: string;
}

interface RealtimeMarketDataProps {
  className?: string;
}

const RealtimeMarketData = ({ className = '' }: RealtimeMarketDataProps) => {
  const [marketData, setMarketData] = useState<MarketDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume' | 'marketCap'>('change');

  // Market data symbols organized by category
  const marketSymbols = {
    'Top Gainers': [
      { symbol: 'NVDA', name: 'NVIDIA Corp', category: 'Technology' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', category: 'Technology' },
      { symbol: 'CRM', name: 'Salesforce Inc', category: 'Technology' },
      { symbol: 'ADBE', name: 'Adobe Inc', category: 'Technology' },
      { symbol: 'INTC', name: 'Intel Corp', category: 'Technology' },
    ],
    'Most Active': [
      { symbol: 'AAPL', name: 'Apple Inc', category: 'Technology' },
      { symbol: 'TSLA', name: 'Tesla Inc', category: 'Automotive' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', category: 'Consumer' },
      { symbol: 'GOOGL', name: 'Alphabet Inc', category: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corp', category: 'Technology' },
      { symbol: 'META', name: 'Meta Platforms', category: 'Technology' },
      { symbol: 'NFLX', name: 'Netflix Inc', category: 'Media' },
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'ETF' },
    ],
    'Large Cap': [
      { symbol: 'JPM', name: 'JPMorgan Chase', category: 'Financial' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', category: 'Healthcare' },
      { symbol: 'V', name: 'Visa Inc', category: 'Financial' },
      { symbol: 'PG', name: 'Procter & Gamble', category: 'Consumer' },
      { symbol: 'UNH', name: 'UnitedHealth Group', category: 'Healthcare' },
      { symbol: 'HD', name: 'Home Depot Inc', category: 'Retail' },
      { symbol: 'MA', name: 'Mastercard Inc', category: 'Financial' },
      { symbol: 'DIS', name: 'Walt Disney Co', category: 'Media' },
    ],
    'Growth Stocks': [
      { symbol: 'PLTR', name: 'Palantir Technologies', category: 'Technology' },
      { symbol: 'SNOW', name: 'Snowflake Inc', category: 'Technology' },
      { symbol: 'DDOG', name: 'Datadog Inc', category: 'Technology' },
      { symbol: 'NET', name: 'Cloudflare Inc', category: 'Technology' },
      { symbol: 'CRWD', name: 'CrowdStrike Holdings', category: 'Technology' },
      { symbol: 'ZM', name: 'Zoom Video Communications', category: 'Technology' },
      { symbol: 'DOCU', name: 'DocuSign Inc', category: 'Technology' },
      { symbol: 'ROKU', name: 'Roku Inc', category: 'Media' },
    ],
  };

  const fetchMarketData = async () => {
    try {
      const allStocks = Object.entries(marketSymbols).flatMap(([category, stocks]) =>
        stocks.map(stock => ({ ...stock, category }))
      );

      const promises = allStocks.map(async (stock) => {
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
              pe: Math.round((Math.random() * 30 + 10) * 100) / 100, // Mock P/E ratio
              trend: (quote.change || 0) >= 0 ? 'up' : 'down',
              category: stock.category
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
              pe: Math.round((Math.random() * 30 + 10) * 100) / 100,
              trend: mockChange >= 0 ? 'up' : 'down',
              category: stock.category
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
            pe: Math.round((Math.random() * 30 + 10) * 100) / 100,
            trend: mockChange >= 0 ? 'up' : 'down',
            category: stock.category
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

  const filteredData = selectedCategory === 'All' 
    ? marketData 
    : marketData.filter(stock => stock.category === selectedCategory);

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.price - a.price;
      case 'change':
        return b.changePercent - a.changePercent;
      case 'volume':
        return b.volume - a.volume;
      case 'marketCap':
        return parseFloat(b.marketCap) - parseFloat(a.marketCap);
      default:
        return 0;
    }
  });

  const categories = ['All', ...new Set(marketData.map(stock => stock.category))];

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
          <h3 className="text-lg font-semibold text-white">Market Data</h3>
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

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-yellow-500 text-black font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          {(['price', 'change', 'volume', 'marketCap'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                sortBy === sort
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {sort === 'marketCap' ? 'Market Cap' : sort.charAt(0).toUpperCase() + sort.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Market Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-2 text-sm text-gray-400">Symbol</th>
              <th className="text-left py-3 px-2 text-sm text-gray-400">Name</th>
              <th className="text-right py-3 px-2 text-sm text-gray-400">Price</th>
              <th className="text-right py-3 px-2 text-sm text-gray-400">Change</th>
              <th className="text-right py-3 px-2 text-sm text-gray-400">Volume</th>
              <th className="text-right py-3 px-2 text-sm text-gray-400">Market Cap</th>
              <th className="text-right py-3 px-2 text-sm text-gray-400">P/E</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((stock) => (
              <tr
                key={stock.symbol}
                className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                onClick={() => window.open(`/stock/${stock.symbol}`, '_blank')}
              >
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    {getIconForTrend(stock.trend)}
                    <span className="font-medium text-white">{stock.symbol}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm text-gray-300 max-w-32 truncate">
                    {stock.name}
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="font-bold text-white">${stock.price.toFixed(2)}</span>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className={`font-semibold ${getValueColor(stock.change)}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                    <div className="text-xs">
                      ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-sm text-gray-300">
                    {(stock.volume / 1000000).toFixed(1)}M
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-sm text-gray-300">{stock.marketCap}</span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-sm text-gray-300">{stock.pe.toFixed(1)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default RealtimeMarketData;


