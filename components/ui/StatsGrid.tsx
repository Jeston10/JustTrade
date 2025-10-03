'use client';

import React from 'react';
import DataDisplay from './DataDisplay';

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  changePercent?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4 | 6;
  className?: string;
}

const StatsGrid = ({ stats, columns = 4, className = '' }: StatsGridProps) => {
  const getGridCols = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 6:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
      default:
        return 'grid-cols-2 md:grid-cols-4';
    }
  };

  return (
    <div className={`grid ${getGridCols()} gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200"
        >
          {stat.icon && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 text-gray-400">{stat.icon}</div>
            </div>
          )}
          <DataDisplay
            label={stat.label}
            value={stat.value}
            change={stat.change}
            changePercent={stat.changePercent}
            trend={stat.trend}
            size="sm"
          />
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
