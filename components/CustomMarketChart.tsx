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

interface MarketData {
    time: string;
    value: number;
    volume: number;
}

interface Company {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: string;
    pe: number;
    logo: string;
}

const CustomMarketChart = () => {
    const [data, setData] = useState<MarketData[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('1Y');
    const [selectedTab, setSelectedTab] = useState('Financial');

    // Generate company data based on selected tab
    const generateCompanies = (tab: string): Company[] => {
        const companyData = {
            Financial: [
                { symbol: 'JPM', name: 'JPMorgan Chase', basePrice: 150, logo: 'https://logo.clearbit.com/jpmorganchase.com' },
                { symbol: 'WFC', name: 'Wells Fargo Co New', basePrice: 45, logo: 'https://logo.clearbit.com/wellsfargo.com' },
                { symbol: 'BAC', name: 'Bank Amer Corp', basePrice: 30, logo: 'https://logo.clearbit.com/bankofamerica.com' },
                { symbol: 'HSBC', name: 'Hsbc Hldgs Plc', basePrice: 35, logo: 'https://logo.clearbit.com/hsbc.com' },
                { symbol: 'C', name: 'Citigroup Inc', basePrice: 55, logo: 'https://logo.clearbit.com/citi.com' },
                { symbol: 'MA', name: 'Mastercard Incorporated', basePrice: 400, logo: 'https://logo.clearbit.com/mastercard.com' }
            ],
            Technology: [
                { symbol: 'AAPL', name: 'Apple Inc', basePrice: 180, logo: 'https://logo.clearbit.com/apple.com' },
                { symbol: 'GOOGL', name: 'Alphabet Inc', basePrice: 140, logo: 'https://logo.clearbit.com/google.com' },
                { symbol: 'MSFT', name: 'Microsoft Corp', basePrice: 350, logo: 'https://logo.clearbit.com/microsoft.com' },
                { symbol: 'META', name: 'Meta Platforms Inc', basePrice: 300, logo: 'https://logo.clearbit.com/meta.com' },
                { symbol: 'ORCL', name: 'Oracle Corp', basePrice: 120, logo: 'https://logo.clearbit.com/oracle.com' },
                { symbol: 'INTC', name: 'Intel Corp', basePrice: 40, logo: 'https://logo.clearbit.com/intel.com' }
            ],
            Services: [
                { symbol: 'AMZN', name: 'Amazon.com Inc', basePrice: 150, logo: 'https://logo.clearbit.com/amazon.com' },
                { symbol: 'BABA', name: 'Alibaba Group Hldg Ltd', basePrice: 80, logo: 'https://logo.clearbit.com/alibaba.com' },
                { symbol: 'T', name: 'At&t Inc', basePrice: 15, logo: 'https://logo.clearbit.com/att.com' },
                { symbol: 'WMT', name: 'Walmart Inc', basePrice: 160, logo: 'https://logo.clearbit.com/walmart.com' },
                { symbol: 'V', name: 'Visa Inc', basePrice: 250, logo: 'https://logo.clearbit.com/visa.com' },
                { symbol: 'NFLX', name: 'Netflix Inc', basePrice: 450, logo: 'https://logo.clearbit.com/netflix.com' }
            ],
            'Realtime Market Data': [
                { symbol: 'SPY', name: 'SPDR S&P 500 ETF', basePrice: 450, logo: 'https://logo.clearbit.com/spdrs.com' },
                { symbol: 'QQQ', name: 'Invesco QQQ Trust', basePrice: 380, logo: 'https://logo.clearbit.com/invesco.com' },
                { symbol: 'IWM', name: 'iShares Russell 2000 ETF', basePrice: 200, logo: 'https://logo.clearbit.com/ishares.com' },
                { symbol: 'VIX', name: 'CBOE Volatility Index', basePrice: 20, logo: 'https://logo.clearbit.com/cboe.com' },
                { symbol: 'GLD', name: 'SPDR Gold Trust', basePrice: 180, logo: 'https://logo.clearbit.com/spdrs.com' },
                { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', basePrice: 90, logo: 'https://logo.clearbit.com/ishares.com' },
                { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', basePrice: 350, logo: 'https://logo.clearbit.com/spdrs.com' },
                { symbol: 'EFA', name: 'iShares MSCI EAFE ETF', basePrice: 70, logo: 'https://logo.clearbit.com/ishares.com' }
            ]
        };

        return companyData[tab as keyof typeof companyData].map(company => {
            const change = (Math.random() - 0.5) * 10;
            const price = company.basePrice + change;
            const changePercent = (change / company.basePrice) * 100;
            
            return {
                symbol: company.symbol,
                name: company.name,
                price: Math.round(price * 100) / 100,
                change: Math.round(change * 100) / 100,
                changePercent: Math.round(changePercent * 100) / 100,
                volume: Math.floor(Math.random() * 10000000) + 1000000,
                marketCap: `${(Math.random() * 2000 + 100).toFixed(1)}B`,
                pe: Math.round((Math.random() * 30 + 10) * 100) / 100,
                logo: company.logo
            };
        });
    };

    // Generate realistic market data for selected company
    const generateMarketData = (timeframe: string, company?: Company) => {
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

        let baseValue = company ? company.price : 5000;
        for (let i = points; i >= 0; i--) {
            const date = new Date(now.getTime() - (i * interval));
            const randomChange = (Math.random() - 0.5) * (company ? company.price * 0.05 : 100);
            baseValue += randomChange;
            
            data.push({
                time: date.toISOString().split('T')[0],
                value: Math.max(0, baseValue),
                volume: Math.floor(Math.random() * 1000000) + 100000
            });
        }
        return data;
    };

    useEffect(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setCompanies(generateCompanies(selectedTab));
            setData(generateMarketData(timeframe, selectedCompany));
            setLoading(false);
        }, 500);
    }, [timeframe, selectedTab, selectedCompany]);

    const handleCompanyClick = (company: Company) => {
        setSelectedCompany(company);
        setData(generateMarketData(timeframe, company));
    };

    const timeframes = ['1D', '1M', '3M', '1Y', '5Y', 'All'];
    const tabs = ['Financial', 'Technology', 'Services', 'Realtime Market Data'];

    if (loading) {
        return (
            <div className="h-[calc(100vh-200px)] w-full flex items-center justify-center">
                <div className="text-white text-xl">
                    Loading market data...
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-200px)] w-full flex gap-4">
            {/* Left side - Chart */}
            <div className="flex-1 bg-[#1a1a1a] rounded-lg p-6 relative overflow-hidden">
                {/* Header with tabs */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`px-4 py-2 rounded-lg transition-all ${
                                    selectedTab === tab
                                        ? 'bg-yellow-500 text-black font-semibold'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="text-white">
                        <h2 className="text-2xl font-bold">
                            {selectedCompany ? `${selectedCompany.symbol} - ${selectedCompany.name}` : 
                             selectedTab === 'Realtime Market Data' ? 'Realtime Market Data' : 'Market Overview'}
                        </h2>
                        <p className="text-sm text-gray-400">
                            {selectedCompany ? 'Individual Stock Analysis' : 
                             selectedTab === 'Realtime Market Data' ? 'Live market indices and ETFs' : 'Real-time market data'}
                        </p>
                    </div>
                </div>

                {/* Timeframe buttons */}
                <div className="flex space-x-2 mb-6">
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

                {/* Chart */}
                <div className="h-[calc(100%-200px)] w-full">
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
                                domain={['dataMin - 100', 'dataMax + 100']}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                                formatter={(value: number) => [value.toFixed(2), 'Value']}
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

                {/* Market stats - moved below chart */}
                <div className="mt-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-400">Current Value</div>
                            <div className="text-xl font-bold text-white">
                                ${data[data.length - 1]?.value.toFixed(2)}
                            </div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-400">24h Change</div>
                            <div className="text-xl font-bold text-green-400">
                                +{((data[data.length - 1]?.value - data[data.length - 2]?.value) || 0).toFixed(2)}
                            </div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="text-sm text-gray-400">Volume</div>
                            <div className="text-xl font-bold text-white">
                                {(data[data.length - 1]?.volume || 0).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right side - Company List */}
            <div className="w-80 bg-[#1a1a1a] rounded-lg p-4 overflow-y-auto">
                <h3 className="text-xl font-bold text-white mb-4">Stocks</h3>
                <div className="space-y-2">
                    {companies.map((company, index) => (
                        <div
                            key={company.symbol}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${
                                selectedCompany?.symbol === company.symbol
                                    ? 'bg-yellow-500/20 border border-yellow-500'
                                    : 'bg-gray-800 hover:bg-gray-700'
                            }`}
                            onClick={() => handleCompanyClick(company)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                                        <img 
                                            src={company.logo} 
                                            alt={`${company.name} logo`}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                // Fallback to initials if logo fails to load
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    parent.innerHTML = `<span class="text-white font-bold text-xs">${company.symbol}</span>`;
                                                    parent.className = "w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs";
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">{company.symbol}</div>
                                        <div className="text-gray-400 text-sm">{company.name}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-bold">${company.price}</div>
                                    <div className={`text-sm ${company.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {company.change >= 0 ? '+' : ''}{company.changePercent.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomMarketChart;
