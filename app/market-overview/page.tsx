import AppLayout from "@/components/AppLayout";
import TradingCard from "@/components/ui/TradingCard";
import RealTimeStatsGrid from "@/components/RealTimeStatsGrid";
import {
    MARKET_OVERVIEW_WIDGET_CONFIG
} from "@/lib/constants";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MarketOverviewClient from "./MarketOverviewClient";
import { BarChart3, TrendingUp, Activity, DollarSign, Globe, Target } from "lucide-react";
import { getMarketIndicesData } from "@/lib/services/market-data.service";

const MarketOverview = async () => {
    const session = await auth.api.getSession({ headers: await headers() });

    if(!session?.user) redirect('/sign-in');

    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
    }

    // Get real-time market data
    const marketIndicesData = await getMarketIndicesData();
    
    // Map real-time data to StatsGrid format
    const marketPerformance = marketIndicesData.map((index, idx) => {
        const icons = [
            <TrendingUp className="w-4 h-4" />,
            <TrendingUp className="w-4 h-4" />,
            <BarChart3 className="w-4 h-4" />,
            <Activity className="w-4 h-4" />,
            <DollarSign className="w-4 h-4" />,
            <Globe className="w-4 h-4" />
        ];

        return {
            label: index.name,
            value: index.value,
            change: index.change,
            changePercent: index.changePercent,
            trend: index.trend,
            icon: icons[idx] || <BarChart3 className="w-4 h-4" />
        };
    });

    return (
        <AppLayout user={user}>
            <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F] p-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Market <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Overview</span>
                            </h1>
                            <p className="text-xl text-gray-300">Real-time market data and comprehensive stock analysis</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                Live Market Data
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                Real-time Analysis
                            </div>
                        </div>
                    </div>

                    {/* Market Performance Stats */}
                    <div className="mb-8">
                        <RealTimeStatsGrid type="market" initialData={marketPerformance} />
                    </div>
                </div>

                {/* Main Chart Section */}
                <TradingCard
                    title="Advanced Market Analysis"
                    subtitle="Interactive charts with real-time data and technical indicators"
                    variant="chart"
                    icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
                    status="live"
                    className="mb-8"
                >
                    <MarketOverviewClient />
                </TradingCard>

                {/* Additional Market Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <TradingCard
                        title="Market Sentiment"
                        subtitle="Current market mood and trends"
                        variant="data"
                        icon={<Target className="w-5 h-5 text-green-400" />}
                        status="live"
                    >
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Bullish</span>
                                <span className="text-green-400 font-semibold">68%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-green-400 h-2 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Bearish</span>
                                <span className="text-red-400 font-semibold">32%</span>
                            </div>
                        </div>
                    </TradingCard>

                    <TradingCard
                        title="Top Gainers"
                        subtitle="Best performing stocks today"
                        variant="data"
                        icon={<TrendingUp className="w-5 h-5 text-green-400" />}
                        status="live"
                    >
                        <div className="space-y-3">
                            {['AAPL', 'MSFT', 'GOOGL'].map((symbol, index) => (
                                <div key={symbol} className="flex justify-between items-center">
                                    <span className="text-white font-medium">{symbol}</span>
                                    <span className="text-green-400 font-semibold">+{2.5 + index * 0.5}%</span>
                                </div>
                            ))}
                        </div>
                    </TradingCard>

                    <TradingCard
                        title="Market Activity"
                        subtitle="Trading volume and activity"
                        variant="data"
                        icon={<Activity className="w-5 h-5 text-blue-400" />}
                        status="live"
                    >
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Total Volume</span>
                                <span className="text-white font-semibold">2.4B</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Active Trades</span>
                                <span className="text-white font-semibold">1.2M</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Market Cap</span>
                                <span className="text-white font-semibold">$45.2T</span>
                            </div>
                        </div>
                    </TradingCard>
                </div>
            </div>
        </AppLayout>
    );
};

export default MarketOverview;
