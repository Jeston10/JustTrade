import AppLayout from "@/components/AppLayout";
import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButtonWrapper from "@/components/WatchlistButtonWrapper";
import TradingCard from "@/components/ui/TradingCard";
import StatsGrid from "@/components/ui/StatsGrid";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Activity, Target } from "lucide-react";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  // Get user session and watchlist status
  const session = await auth.api.getSession({ headers: await headers() });
  let isInWatchlist = false;
  
  if (session?.user?.email) {
    const watchlistSymbols = await getWatchlistSymbolsByEmail(session.user.email);
    isInWatchlist = watchlistSymbols.includes(symbol.toUpperCase());
  }

  // Mock stock performance data
  const stockStats = [
    {
      label: "Current Price",
      value: "$156.78",
      change: 2.34,
      changePercent: 1.51,
      trend: "up" as const,
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      label: "24h High",
      value: "$158.45",
      change: 0,
      changePercent: 0,
      trend: "neutral" as const,
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      label: "24h Low",
      value: "$154.23",
      change: 0,
      changePercent: 0,
      trend: "neutral" as const,
      icon: <TrendingDown className="w-4 h-4" />
    },
    {
      label: "Volume",
      value: "2.4M",
      change: 0.15,
      changePercent: 6.67,
      trend: "up" as const,
      icon: <Activity className="w-4 h-4" />
    },
    {
      label: "Market Cap",
      value: "$2.4T",
      change: 1.2,
      changePercent: 0.05,
      trend: "up" as const,
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      label: "P/E Ratio",
      value: "28.45",
      change: -0.5,
      changePercent: -1.73,
      trend: "down" as const,
      icon: <Target className="w-4 h-4" />
    }
  ];

  const user = session?.user ? {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  } : null;

  if (!user) {
    return <div>Please sign in to view stock details.</div>;
  }

  return (
    <AppLayout user={user}>
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F] p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {symbol.toUpperCase()} <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Analysis</span>
            </h1>
            <p className="text-xl text-gray-300">Comprehensive financial analysis and market data</p>
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

        {/* Stock Performance Stats */}
        <StatsGrid stats={stockStats} columns={6} className="mb-8" />
      </div>

      {/* Main Content Grid */}
      <div className="space-y-8 mb-8">
        {/* Stock Information */}
        <TradingCard
          title="Stock Information"
          subtitle="Real-time stock data and key metrics"
          variant="data"
          icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
          status="live"
          actions={
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">Live Data</div>
              <WatchlistButtonWrapper 
                symbol={symbol.toUpperCase()} 
                company={symbol.toUpperCase()} 
                isInWatchlist={isInWatchlist}
              />
            </div>
          }
        >
          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={200}
            className="rounded-lg overflow-hidden w-full"
          />
        </TradingCard>

        {/* Main Chart - Full Width */}
        <TradingCard
          title="Chart Analytics"
          subtitle="Interactive candlestick chart with technical indicators"
          variant="chart"
          icon={<BarChart3 className="w-5 h-5 text-yellow-400" />}
          status="live"
        >
          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
            className="custom-chart rounded-lg overflow-hidden"
            height={700}
          />
        </TradingCard>

        {/* Analytics Chart - Full Width */}
        <TradingCard
          title="Market Analytics"
          subtitle="Advanced market analysis and trend indicators"
          variant="chart"
          icon={<Activity className="w-5 h-5 text-purple-400" />}
          status="live"
        >
          <TradingViewWidget
            scriptUrl={`${scriptUrl}advanced-chart.js`}
            config={BASELINE_WIDGET_CONFIG(symbol)}
            className="custom-chart rounded-lg overflow-hidden"
            height={600}
          />
        </TradingCard>
      </div>

      {/* Financial Data Section - Full Width */}
      <TradingCard
        title="Financial Data"
        subtitle="Comprehensive financial metrics and company performance"
        variant="data"
        icon={<DollarSign className="w-5 h-5 text-green-400" />}
        status="live"
        className="mb-6"
      >
        <TradingViewWidget
          scriptUrl={`${scriptUrl}financials.js`}
          config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
          height={800}
          className="w-full rounded-lg overflow-hidden"
        />
      </TradingCard>

      {/* Technical Analysis Section - Full Width */}
      <TradingCard
        title="Technical Analysis"
        subtitle="Expert technical indicators and market insights"
        variant="data"
        icon={<Target className="w-5 h-5 text-blue-400" />}
        status="live"
      >
        <TradingViewWidget
          scriptUrl={`${scriptUrl}technical-analysis.js`}
          config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
          height={600}
          className="w-full rounded-lg overflow-hidden"
        />
      </TradingCard>
      </div>
    </AppLayout>
  );
}
