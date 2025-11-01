import AppLayout from "@/components/AppLayout";
import TradingCard from "@/components/ui/TradingCard";
import RealTimeStatsGrid from "@/components/RealTimeStatsGrid";
import StockDetailClient from "./StockDetailClient";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getStockQuote } from "@/lib/actions/finnhub.actions";
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Globe, Target, Clock } from "lucide-react";

interface StockDetailPageProps {
  params: Promise<{
    symbol: string;
  }>;
}

const StockDetailPage = async ({ params }: StockDetailPageProps) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect('/sign-in');

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };

  const { symbol: symbolParam } = await params;
  const symbol = symbolParam.toUpperCase();
  
  // Fetch real-time stock data
  let stockData = null;
  try {
    stockData = await getStockQuote(symbol);
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }

  // Create stock stats for the RealTimeStatsGrid
  const stockStats = stockData ? [
    {
      label: 'Current Price',
      value: `$${stockData.currentPrice?.toFixed(2) || 'N/A'}`,
      change: stockData.change || 0,
      changePercent: stockData.changePercent || 0,
      trend: (stockData.change || 0) >= 0 ? 'up' : 'down',
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      label: 'Previous Close',
      value: `$${stockData.previousClose?.toFixed(2) || 'N/A'}`,
      change: 0,
      changePercent: 0,
      trend: 'neutral' as const,
      icon: <Clock className="w-4 h-4" />
    },
    {
      label: 'Day High',
      value: `$${stockData.high?.toFixed(2) || 'N/A'}`,
      change: 0,
      changePercent: 0,
      trend: 'neutral' as const,
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      label: 'Day Low',
      value: `$${stockData.low?.toFixed(2) || 'N/A'}`,
      change: 0,
      changePercent: 0,
      trend: 'neutral' as const,
      icon: <TrendingDown className="w-4 h-4" />
    },
    {
      label: 'Volume',
      value: stockData.volume ? `${(stockData.volume / 1000000).toFixed(1)}M` : 'N/A',
      change: 0,
      changePercent: 0,
      trend: 'neutral' as const,
      icon: <Activity className="w-4 h-4" />
    },
    {
      label: 'Market Status',
      value: stockData.isMarketOpen ? 'OPEN' : 'CLOSED',
      change: 0,
      changePercent: 0,
      trend: 'neutral' as const,
      icon: <Globe className="w-4 h-4" />
    }
  ] : [];

  return (
    <AppLayout user={user}>
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F] p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {symbol} <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Stock Details</span>
              </h1>
              <p className="text-xl text-gray-300">Real-time stock analysis and market data</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live Stock Data
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                Real-time Updates
              </div>
            </div>
          </div>

          {/* Stock Stats */}
          {stockStats.length > 0 && (
            <RealTimeStatsGrid type="market" initialData={stockStats} />
          )}
        </div>

        {/* Main Chart Section */}
        <TradingCard
          title={`${symbol} - Advanced Chart Analysis`}
          subtitle="Interactive charts with real-time data and technical indicators"
          variant="chart"
          icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
          status="live"
          className="mb-8"
        >
          <StockDetailClient symbol={symbol} />
        </TradingCard>

        {/* Additional Stock Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TradingCard
            title="Key Metrics"
            subtitle="Essential financial indicators"
            variant="data"
            icon={<Target className="w-5 h-5 text-green-400" />}
            status="live"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">P/E Ratio</span>
                <span className="text-white font-semibold">24.5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Market Cap</span>
                <span className="text-white font-semibold">$3.2T</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">52W High</span>
                <span className="text-white font-semibold">$205.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">52W Low</span>
                <span className="text-white font-semibold">$124.17</span>
              </div>
            </div>
          </TradingCard>

          <TradingCard
            title="Price Targets"
            subtitle="Analyst price predictions"
            variant="data"
            icon={<TrendingUp className="w-5 h-5 text-green-400" />}
            status="live"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Average Target</span>
                <span className="text-green-400 font-semibold">$195.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">High Target</span>
                <span className="text-green-400 font-semibold">$220.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Low Target</span>
                <span className="text-red-400 font-semibold">$165.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Consensus</span>
                <span className="text-yellow-400 font-semibold">BUY</span>
              </div>
            </div>
          </TradingCard>

          <TradingCard
            title="Trading Activity"
            subtitle="Market activity and sentiment"
            variant="data"
            icon={<Activity className="w-5 h-5 text-blue-400" />}
            status="live"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg Volume</span>
                <span className="text-white font-semibold">52.3M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Beta</span>
                <span className="text-white font-semibold">1.24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Short Interest</span>
                <span className="text-white font-semibold">1.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Insider Trading</span>
                <span className="text-green-400 font-semibold">BUY</span>
              </div>
            </div>
          </TradingCard>
        </div>
      </div>
    </AppLayout>
  );
};

export default StockDetailPage;
