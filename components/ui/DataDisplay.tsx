'use client';

import React from 'react';

interface DataDisplayProps {
  label: string;
  value: string | number;
  change?: number;
  changePercent?: number;
  trend?: 'up' | 'down' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DataDisplay = ({
  label,
  value,
  change,
  changePercent,
  trend = 'neutral',
  size = 'md',
  className = ''
}: DataDisplayProps) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          label: 'text-xs text-gray-400',
          value: 'text-sm font-semibold text-white',
          change: 'text-xs'
        };
      case 'lg':
        return {
          label: 'text-sm text-gray-400',
          value: 'text-2xl font-bold text-white',
          change: 'text-sm font-medium'
        };
      default:
        return {
          label: 'text-sm text-gray-400',
          value: 'text-lg font-semibold text-white',
          change: 'text-sm'
        };
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const formatChange = (change: number, percent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
  };

  const styles = getSizeStyles();

  return (
    <div className={`space-y-1 ${className}`}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{formatValue(value)}</div>
      {(change !== undefined && changePercent !== undefined) && (
        <div className={`${styles.change} ${getTrendColor()}`}>
          {formatChange(change, changePercent)}
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
