'use client';

import React from 'react';

interface TradingCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  status?: 'live' | 'loading' | 'offline';
  actions?: React.ReactNode;
  variant?: 'default' | 'chart' | 'data' | 'news' | 'compact';
}

const TradingCard = ({
  children,
  className = '',
  title,
  subtitle,
  icon,
  status = 'live',
  actions,
  variant = 'default'
}: TradingCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'chart':
        return 'bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-gray-700/50 shadow-2xl';
      case 'data':
        return 'bg-gradient-to-br from-gray-900/70 to-gray-800/50 border border-gray-700/40 shadow-xl';
      case 'news':
        return 'bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/30 shadow-lg';
      case 'compact':
        return 'bg-gradient-to-br from-gray-900/90 to-gray-800/70 border border-gray-700/60 shadow-lg';
      default:
        return 'bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-gray-700/50 shadow-2xl';
    }
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'live':
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
        );
      case 'loading':
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-yellow-400 font-medium">LOADING</span>
          </div>
        );
      case 'offline':
        return (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-xs text-red-400 font-medium">OFFLINE</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden backdrop-blur-sm ${getVariantStyles()} ${className}`}
    >
      {/* Header */}
      {(title || subtitle || icon || status !== 'live' || actions) && (
        <div className="px-6 py-4 border-b border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {title}
                    {getStatusIndicator()}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {children}
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/10 pointer-events-none"></div>
    </div>
  );
};

export default TradingCard;
