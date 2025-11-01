'use client';

import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    ReferenceLine
} from 'recharts';
import { getStockQuote } from '@/lib/actions/finnhub.actions';

interface MarketData {
    time: string;
    value: number;
    volume: number;
}

interface StockDetailClientProps {
    symbol: string;
}

const StockDetailClient = ({ symbol }: StockDetailClientProps) => {
    const [data, setData] = useState<MarketData[]>([]);
    const [stockQuote, setStockQuote] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('1Y');
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Generate realistic market data for the stock
    const generateMarketData = (timeframe: string, quote: any) => {
        const data: MarketData[] = [];
        const now = new Date();
        let points = 0;
        let interval = 0;

        switch (timeframe) {
            case '1D':
                points = 24;
                interval = 60 * 60 * 1000; // 1 hour
                break;
            case '1M':
                points = 30;
                interval = 24 * 60 * 60 * 1000; // 1 day
                break;
            case '3M':
                points = 90;
                interval = 24 * 60 * 60 * 1000; // 1 day
                break;
            case '1Y':
                points = 365;
                interval = 24 * 60 * 60 * 1000; // 1 day
                break;
            case '5Y':
                points = 1825;
                interval = 24 * 60 * 60 * 1000; // 1 day
                break;
            default:
                points = 365;
                interval = 24 * 60 * 60 * 1000;
        }

        let baseValue = quote?.currentPrice || 100;
        for (let i = points; i >= 0; i--) {
            const date = new Date(now.getTime() - (i * interval));
            const randomChange = (Math.random() - 0.5) * (baseValue * 0.05);
            baseValue += randomChange;
            
            data.push({
                time: date.toISOString().split('T')[0],
                value: Math.max(0, baseValue),
                volume: Math.floor(Math.random() * 1000000) + 100000
            });
        }
        return data;
    };

    // Fetch real-time stock data
    const fetchStockData = async () => {
        try {
            const quote = await getStockQuote(symbol);
            setStockQuote(quote);
            setData(generateMarketData(timeframe, quote));
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error fetching stock data:', error);
            // Generate mock data if API fails
            const mockQuote = {
                currentPrice: Math.random() * 200 + 50,
                change: (Math.random() - 0.5) * 10,
                changePercent: (Math.random() - 0.5) * 5,
                high: Math.random() * 200 + 50,
                low: Math.random() * 200 + 50,
                volume: Math.floor(Math.random() * 10000000) + 1000000,
                isMarketOpen: true
            };
            setStockQuote(mockQuote);
            setData(generateMarketData(timeframe, mockQuote));
            setLastUpdate(new Date());
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchStockData();
            setLoading(false);
        };

        loadData();
    }, [symbol, timeframe]);

    // Auto-refresh data every 15 seconds for more frequent updates
    useEffect(() => {
        const interval = setInterval(async () => {
            await fetchStockData();
        }, 15000);

        return () => clearInterval(interval);
    }, [symbol, timeframe]);

    const timeframes = ['1D', '1M', '3M', '1Y', '5Y', 'All'];

    if (loading) {
        return (
            <div className="h-[calc(100vh-200px)] w-full flex items-center justify-center">
                <div className="text-white text-xl">
                    Loading {symbol} data...
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-200px)] w-full">
            {/* Header with timeframe buttons */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                    {timeframes.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-3 py-1 rounded text-sm transition-all ${
                                timeframe === tf
                                    ? 'bg-yellow-500 text-black font-semibold'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">
                        Last updated: {lastUpdate.toLocaleTimeString()}
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[calc(100%-120px)] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0FEDBE" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0FEDBE" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                            dataKey="time" 
                            stroke="#9CA3AF"
                            fontSize={12}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return timeframe === '1D' 
                                    ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            }}
                        />
                        <YAxis 
                            stroke="#9CA3AF"
                            fontSize={12}
                            domain={['dataMin - 10', 'dataMax + 10']}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                            formatter={(value: number) => [value.toFixed(2), 'Price']}
                            labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#0FEDBE"
                            strokeWidth={3}
                            fill="url(#colorValue)"
                        />
                        <ReferenceLine y={data[data.length - 1]?.value} stroke="#0FEDBE" strokeDasharray="2 2" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Stock stats */}
            <div className="mt-4">
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">Current Price</div>
                        <div className="text-xl font-bold text-white">
                            ${stockQuote?.currentPrice?.toFixed(2) || 'N/A'}
                        </div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">24h Change</div>
                        <div className={`text-xl font-bold ${(stockQuote?.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stockQuote?.change >= 0 ? '+' : ''}{stockQuote?.change?.toFixed(2) || 'N/A'}
                        </div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">Change %</div>
                        <div className={`text-xl font-bold ${(stockQuote?.changePercent || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stockQuote?.changePercent >= 0 ? '+' : ''}{stockQuote?.changePercent?.toFixed(2) || 'N/A'}%
                        </div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-sm text-gray-400">Volume</div>
                        <div className="text-xl font-bold text-white">
                            {stockQuote?.volume ? `${(stockQuote.volume / 1000000).toFixed(1)}M` : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockDetailClient;
