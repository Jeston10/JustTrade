import TradingViewWidget from "@/components/TradingViewWidget";
import TradingCard from "@/components/ui/TradingCard";
import StatsGrid from "@/components/ui/StatsGrid";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";
import {sendDailyNewsSummary} from "@/lib/inngest/functions";
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Globe } from "lucide-react";

const Home = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    // Mock market stats data
    const marketStats = [
        {
            label: "S&P 500",
            value: "4,567.89",
            change: 23.45,
            changePercent: 0.52,
            trend: "up" as const,
            icon: <TrendingUp className="w-4 h-4" />
        },
        {
            label: "NASDAQ",
            value: "14,234.56",
            change: -12.34,
            changePercent: -0.09,
            trend: "down" as const,
            icon: <TrendingDown className="w-4 h-4" />
        },
        {
            label: "DOW JONES",
            value: "34,567.89",
            change: 156.78,
            changePercent: 0.46,
            trend: "up" as const,
            icon: <BarChart3 className="w-4 h-4" />
        },
        {
            label: "VOLATILITY",
            value: "18.45",
            change: -1.23,
            changePercent: -6.25,
            trend: "down" as const,
            icon: <Activity className="w-4 h-4" />
        },
        {
            label: "TOTAL VOLUME",
            value: "2.4B",
            change: 0.15,
            changePercent: 6.67,
            trend: "up" as const,
            icon: <DollarSign className="w-4 h-4" />
        },
        {
            label: "GLOBAL MARKETS",
            value: "ACTIVE",
            change: 0,
            changePercent: 0,
            trend: "neutral" as const,
            icon: <Globe className="w-4 h-4" />
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F] p-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Trading <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Dashboard</span>
                        </h1>
                        <p className="text-xl text-gray-300">Real-time market data and analysis</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            Live Market Data
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            Real-time Updates
                        </div>
                    </div>
                </div>

                {/* Market Stats */}
                <StatsGrid stats={marketStats} columns={6} className="mb-8" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Market Overview */}
                <TradingCard
                    title="Market Overview"
                    subtitle="Real-time market performance"
                    variant="chart"
                    icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
                    status="live"
                >
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-overview.js`}
                        config={MARKET_OVERVIEW_WIDGET_CONFIG}
                        className="custom-chart rounded-lg"
                        height={500}
                    />
                </TradingCard>

                {/* Stock Heatmap */}
                <TradingCard
                    title="Stock Heatmap"
                    subtitle="Sector performance visualization"
                    variant="chart"
                    icon={<Activity className="w-5 h-5 text-green-400" />}
                    status="live"
                    className="xl:col-span-2"
                >
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        height={500}
                    />
                </TradingCard>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Market News */}
                <TradingCard
                    title="Market News"
                    subtitle="Latest financial updates"
                    variant="news"
                    icon={<Globe className="w-5 h-5 text-purple-400" />}
                    status="live"
                >
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}timeline.js`}
                        config={TOP_STORIES_WIDGET_CONFIG}
                        height={400}
                    />
                </TradingCard>

                {/* Market Data */}
                <TradingCard
                    title="Market Data"
                    subtitle="Live stock quotes and data"
                    variant="data"
                    icon={<DollarSign className="w-5 h-5 text-yellow-400" />}
                    status="live"
                    className="xl:col-span-2"
                >
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={MARKET_DATA_WIDGET_CONFIG}
                        height={400}
                    />
                </TradingCard>
            </div>
        </div>
    )
}

export default Home;
