import AppLayout from "@/components/AppLayout";
import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistComponent from "@/components/WatchlistComponent";
import TradingCard from "@/components/ui/TradingCard";
import RealTimeStatsGrid from "@/components/RealTimeStatsGrid";
import {
    HEATMAP_WIDGET_CONFIG
} from "@/lib/constants";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import { Activity, TrendingUp, TrendingDown, BarChart3, Target, Eye } from "lucide-react";
import { getSectorPerformanceData } from "@/lib/services/market-data.service";

const Heatmap = async () => {
    const session = await auth.api.getSession({ headers: await headers() });

    if(!session?.user) redirect('/sign-in');

    const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
    }

    // Get user's watchlist and convert to plain objects
    const watchlistData = await getUserWatchlist(user.email);
    const watchlist = watchlistData.map(item => ({
        _id: item._id.toString(),
        userId: item.userId,
        symbol: item.symbol,
        company: item.company,
        addedAt: item.addedAt.toISOString()
    }));

    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    // Get real-time sector performance data
    const sectorData = await getSectorPerformanceData();
    
    // Map real-time data to StatsGrid format
    const sectorPerformance = sectorData.map((sector, idx) => {
        const icons = [
            <TrendingUp className="w-4 h-4" />,
            <TrendingUp className="w-4 h-4" />,
            <TrendingDown className="w-4 h-4" />,
            <TrendingUp className="w-4 h-4" />,
            <TrendingUp className="w-4 h-4" />,
            <TrendingDown className="w-4 h-4" />
        ];

        return {
            label: sector.name,
            value: sector.value,
            change: sector.change,
            changePercent: sector.changePercent,
            trend: sector.trend,
            icon: icons[idx] || <TrendingUp className="w-4 h-4" />
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
                                Stock <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">Heatmap</span>
                            </h1>
                            <p className="text-xl text-gray-300">Visual representation of stock performance across different sectors</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                Live Data
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                Heatmap Active
                            </div>
                        </div>
                    </div>

                    {/* Sector Performance Stats */}
                    <div className="mb-8">
                        <RealTimeStatsGrid type="sector" initialData={sectorPerformance} />
                    </div>
                </div>

                {/* Main Heatmap Section */}
                <TradingCard
                    title="Sector Performance Heatmap"
                    subtitle="Real-time visualization of stock performance across all sectors"
                    variant="chart"
                    icon={<Activity className="w-5 h-5 text-red-400" />}
                    status="live"
                    className="mb-8"
                >
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        className="w-full rounded-lg overflow-hidden"
                        height={600}
                    />
                </TradingCard>

                {/* Watchlist Section */}
                <TradingCard
                    title="Your Watchlist"
                    subtitle="Track your favorite stocks and their performance"
                    variant="data"
                    icon={<Eye className="w-5 h-5 text-blue-400" />}
                    status="live"
                    actions={
                        <button className="text-sm text-gray-400 hover:text-white transition-colors">
                            View all
                        </button>
                    }
                >
                    <WatchlistComponent 
                        initialWatchlist={watchlist}
                        userEmail={user.email}
                    />
                </TradingCard>
            </div>
        </AppLayout>
    );
};

export default Heatmap;
