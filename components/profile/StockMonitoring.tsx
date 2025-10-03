'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Star, Trash2, Bell, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface StockMonitoringProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

interface WatchlistItem {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    alerts: {
        priceAbove: number | null;
        priceBelow: number | null;
        volumeSpike: boolean;
        newsAlert: boolean;
    };
}

const StockMonitoring = ({ user }: StockMonitoringProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
        {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            price: 156.78,
            change: 2.34,
            changePercent: 1.51,
            alerts: {
                priceAbove: 160,
                priceBelow: 150,
                volumeSpike: true,
                newsAlert: true
            }
        },
        {
            symbol: 'MSFT',
            name: 'Microsoft Corporation',
            price: 350.45,
            change: -1.23,
            changePercent: -0.35,
            alerts: {
                priceAbove: 360,
                priceBelow: 340,
                volumeSpike: false,
                newsAlert: true
            }
        }
    ]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        
        setIsSearching(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSearchResults([
                { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.23, change: 1.45, changePercent: 1.04 },
                { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.67, change: -3.21, changePercent: -1.29 },
                { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.89, change: 0.78, changePercent: 0.54 }
            ]);
        } catch (error) {
            toast.error('Search failed');
        } finally {
            setIsSearching(false);
        }
    };

    const addToWatchlist = (stock: any) => {
        const newItem: WatchlistItem = {
            symbol: stock.symbol,
            name: stock.name,
            price: stock.price,
            change: stock.change,
            changePercent: stock.changePercent,
            alerts: {
                priceAbove: null,
                priceBelow: null,
                volumeSpike: false,
                newsAlert: false
            }
        };
        setWatchlist(prev => [...prev, newItem]);
        toast.success(`${stock.symbol} added to watchlist`);
    };

    const removeFromWatchlist = (symbol: string) => {
        setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
        toast.success(`${symbol} removed from watchlist`);
    };

    const updateAlert = (symbol: string, alertType: string, value: any) => {
        setWatchlist(prev => prev.map(item => 
            item.symbol === symbol 
                ? { ...item, alerts: { ...item.alerts, [alertType]: value } }
                : item
        ));
    };

    return (
        <div className="space-y-4">
            {/* Search Section */}
            <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Add Stocks to Monitor
                </h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for stocks..."
                        className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded hover:bg-yellow-500 transition-colors disabled:opacity-50 text-sm"
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {searchResults.map((stock) => (
                            <div key={stock.symbol} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                                <div>
                                    <div className="font-semibold text-white text-sm">{stock.symbol}</div>
                                    <div className="text-xs text-gray-400">{stock.name}</div>
                                    <div className="text-xs text-gray-300">
                                        ${stock.price} 
                                        <span className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                                            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => addToWatchlist(stock)}
                                    className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Watchlist */}
            <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Your Watchlist ({watchlist.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {watchlist.map((item) => (
                        <div
                            key={item.symbol}
                            className="p-3 bg-gray-800/30 rounded border border-gray-700/50"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <div className="font-semibold text-white text-sm">{item.symbol}</div>
                                    <div className="text-xs text-gray-400">{item.name}</div>
                                    <div className="text-xs text-gray-300">
                                        ${item.price} 
                                        <span className={item.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                                            {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromWatchlist(item.symbol)}
                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Alert Settings */}
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Price Above</label>
                                        <input
                                            type="number"
                                            value={item.alerts.priceAbove || ''}
                                            onChange={(e) => updateAlert(item.symbol, 'priceAbove', e.target.value ? parseFloat(e.target.value) : null)}
                                            placeholder="Set alert"
                                            className="w-full px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-white text-xs placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Price Below</label>
                                        <input
                                            type="number"
                                            value={item.alerts.priceBelow || ''}
                                            onChange={(e) => updateAlert(item.symbol, 'priceBelow', e.target.value ? parseFloat(e.target.value) : null)}
                                            placeholder="Set alert"
                                            className="w-full px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-white text-xs placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={item.alerts.volumeSpike}
                                            onChange={(e) => updateAlert(item.symbol, 'volumeSpike', e.target.checked)}
                                            className="mr-1"
                                        />
                                        <span className="text-xs text-gray-300">Volume Spike</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={item.alerts.newsAlert}
                                            onChange={(e) => updateAlert(item.symbol, 'newsAlert', e.target.checked)}
                                            className="mr-1"
                                        />
                                        <span className="text-xs text-gray-300">News Alert</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
                <button
                    className="flex-1 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white font-semibold rounded hover:from-blue-500 hover:to-cyan-600 transition-all text-sm"
                >
                    <BarChart3 className="w-3 h-3 inline mr-1" />
                    View Analytics
                </button>
                <button
                    className="flex-1 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold rounded hover:from-purple-500 hover:to-pink-600 transition-all text-sm"
                >
                    <Bell className="w-3 h-3 inline mr-1" />
                    Manage Alerts
                </button>
            </div>
        </div>
    );
};

export default StockMonitoring;
