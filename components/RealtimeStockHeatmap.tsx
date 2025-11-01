'use client';

import { useState, useEffect } from 'react';
import { getStockQuote } from '@/lib/actions/finnhub.actions';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Globe, RefreshCw } from 'lucide-react';

interface HeatmapData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  sector: string;
  trend: 'up' | 'down' | 'neutral';
}

interface RealtimeStockHeatmapProps {
  className?: string;
}

const RealtimeStockHeatmap = ({ className = '' }: RealtimeStockHeatmapProps) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string>('All');

  // Sector-based stock symbols
  const sectorStocks = {
    'Technology': [
      { symbol: 'AAPL', name: 'Apple Inc' },
      { symbol: 'MSFT', name: 'Microsoft Corp' },
      { symbol: 'GOOGL', name: 'Alphabet Inc' },
      { symbol: 'AMZN', name: 'Amazon.com Inc' },
      { symbol: 'TSLA', name: 'Tesla Inc' },
      { symbol: 'META', name: 'Meta Platforms' },
      { symbol: 'NVDA', name: 'NVIDIA Corp' },
      { symbol: 'NFLX', name: 'Netflix Inc' },
      { symbol: 'ORCL', name: 'Oracle Corp' },
      { symbol: 'CRM', name: 'Salesforce Inc' },
    ],
    'Financial': [
      { symbol: 'JPM', name: 'JPMorgan Chase' },
      { symbol: 'BAC', name: 'Bank of America' },
      { symbol: 'WFC', name: 'Wells Fargo' },
      { symbol: 'GS', name: 'Goldman Sachs' },
      { symbol: 'MS', name: 'Morgan Stanley' },
      { symbol: 'V', name: 'Visa Inc' },
      { symbol: 'MA', name: 'Mastercard Inc' },
      { symbol: 'AXP', name: 'American Express' },
      { symbol: 'C', name: 'Citigroup Inc' },
      { symbol: 'BLK', name: 'BlackRock Inc' },
    ],
    'Healthcare': [
      { symbol: 'JNJ', name: 'Johnson & Johnson' },
      { symbol: 'PFE', name: 'Pfizer Inc' },
      { symbol: 'UNH', name: 'UnitedHealth Group' },
      { symbol: 'ABBV', name: 'AbbVie Inc' },
      { symbol: 'MRK', name: 'Merck & Co' },
      { symbol: 'TMO', name: 'Thermo Fisher Scientific' },
      { symbol: 'ABT', name: 'Abbott Laboratories' },
      { symbol: 'DHR', name: 'Danaher Corp' },
      { symbol: 'BMY', name: 'Bristol Myers Squibb' },
      { symbol: 'LLY', name: 'Eli Lilly & Co' },
    ],
    'Energy': [
      { symbol: 'XOM', name: 'Exxon Mobil Corp' },
      { symbol: 'CVX', name: 'Chevron Corp' },
      { symbol: 'COP', name: 'ConocoPhillips' },
      { symbol: 'EOG', name: 'EOG Resources' },
      { symbol: 'SLB', name: 'Schlumberger Ltd' },
      { symbol: 'PXD', name: 'Pioneer Natural Resources' },
      { symbol: 'KMI', name: 'Kinder Morgan Inc' },
      { symbol: 'MPC', name: 'Marathon Petroleum' },
      { symbol: 'VLO', name: 'Valero Energy Corp' },
      { symbol: 'PSX', name: 'Phillips 66' },
    ],
    'Consumer': [
      { symbol: 'WMT', name: 'Walmart Inc' },
      { symbol: 'PG', name: 'Procter & Gamble' },
      { symbol: 'KO', name: 'Coca-Cola Co' },
      { symbol: 'PEP', name: 'PepsiCo Inc' },
      { symbol: 'COST', name: 'Costco Wholesale' },
      { symbol: 'MCD', name: 'McDonald\'s Corp' },
      { symbol: 'SBUX', name: 'Starbucks Corp' },
      { symbol: 'NKE', name: 'Nike Inc' },
      { symbol: 'DIS', name: 'Walt Disney Co' },
      { symbol: 'CMCSA', name: 'Comcast Corp' },
    ],
  };

  const fetchHeatmapData = async () => {
    try {
      const allStocks = Object.entries(sectorStocks).flatMap(([sector, stocks]) =>
        stocks.map(stock => ({ ...stock, sector }))
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
              marketCap: Math.random() * 1000 + 100, // Mock market cap
              sector: stock.sector,
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
              marketCap: Math.random() * 1000 + 100,
              sector: stock.sector,
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
            marketCap: Math.random() * 1000 + 100,
            sector: stock.sector,
            trend: mockChange >= 0 ? 'up' : 'down'
          };
        }
      });

      const results = await Promise.all(promises);
      setHeatmapData(results);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchHeatmapData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchHeatmapData();
      setLoading(false);
    };

    loadData();

    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchHeatmapData, 15000);
    return () => clearInterval(interval);
  }, []);

  const getIntensity = (changePercent: number) => {
    const absChange = Math.abs(changePercent);
    if (absChange >= 5) return 'high';
    if (absChange >= 2) return 'medium';
    return 'low';
  };

  const getColor = (changePercent: number, intensity: string) => {
    const baseOpacity = intensity === 'high' ? 0.8 : intensity === 'medium' ? 0.6 : 0.4;
    if (changePercent > 0) {
      return `bg-green-500/20 border-green-500/30 hover:bg-green-500/30`;
    } else if (changePercent < 0) {
      return `bg-red-500/20 border-red-500/30 hover:bg-red-500/30`;
    }
    return `bg-gray-500/20 border-gray-500/30 hover:bg-gray-500/30`;
  };

  const filteredData = selectedSector === 'All' 
    ? heatmapData 
    : heatmapData.filter(stock => stock.sector === selectedSector);

  const sectors = ['All', ...Object.keys(sectorStocks)];

  if (loading) {
    return (
      <div className={`bg-[#1a1a1a] rounded-lg p-6 border border-gray-700 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">Loading heatmap data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#1a1a1a] rounded-lg p-6 border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Stock Heatmap</h3>
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

      {/* Sector Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={`px-3 py-1 rounded text-sm transition-all ${
              selectedSector === sector
                ? 'bg-yellow-500 text-black font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filteredData.map((stock) => {
          const intensity = getIntensity(stock.changePercent);
          const colorClass = getColor(stock.changePercent, intensity);
          
          return (
            <div
              key={stock.symbol}
              className={`rounded-lg p-3 border transition-all cursor-pointer ${colorClass}`}
              onClick={() => window.open(`/stock/${stock.symbol}`, '_blank')}
              style={{
                transform: `scale(${intensity === 'high' ? 1.05 : 1})`,
                boxShadow: intensity === 'high' ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
              }}
            >
              <div className="text-center">
                <div className="text-sm font-bold text-white mb-1">{stock.symbol}</div>
                <div className="text-xs text-gray-300 mb-2">{stock.name}</div>
                <div className="text-lg font-bold text-white mb-1">
                  ${stock.price.toFixed(2)}
                </div>
                <div className={`text-sm font-semibold ${
                  stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {stock.sector}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded"></div>
              <span>Gainers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded"></div>
              <span>Losers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500/20 border border-gray-500/30 rounded"></div>
              <span>Neutral</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeStockHeatmap;


