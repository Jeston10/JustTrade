'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Globe, RefreshCw } from 'lucide-react';

interface RealtimeWidgetProps {
  title: string;
  data: any[];
  type: 'market' | 'sector' | 'stock';
  refreshInterval?: number;
  className?: string;
}

const RealtimeWidget = ({ 
  title, 
  data, 
  type, 
  refreshInterval = 15000, 
  className = '' 
}: RealtimeWidgetProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  // Auto-refresh indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

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

  return (
    <div className={`bg-[#1a1a1a] rounded-lg p-6 border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
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

      {/* Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getIconForTrend(item.trend)}
                <span className="text-sm text-gray-400">{item.label}</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{item.value}</div>
                {item.change !== undefined && (
                  <div className={`text-sm ${getValueColor(item.change)}`}>
                    {item.change >= 0 ? '+' : ''}{item.change?.toFixed(2)}
                    {item.changePercent !== undefined && (
                      <span className="ml-1">
                        ({item.changePercent >= 0 ? '+' : ''}{item.changePercent?.toFixed(2)}%)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          <span>Auto-refresh: {refreshInterval / 1000}s</span>
        </div>
      </div>
    </div>
  );
};

export default RealtimeWidget;

