'use client';

import { useState, useEffect } from 'react';
import { getMarketNews, NewsArticle } from '@/lib/services/market-news.service';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Globe, RefreshCw, ExternalLink, Clock } from 'lucide-react';

interface RealtimeMarketNewsProps {
  className?: string;
}

const RealtimeMarketNews = ({ className = '' }: RealtimeMarketNewsProps) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNews = async () => {
    try {
      const newsData = await getMarketNews(8);
      setNews(newsData.articles);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNews();
    setIsRefreshing(false);
  };

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      await fetchNews();
      setLoading(false);
    };

    loadNews();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'border-l-green-500 bg-green-500/5';
      case 'negative':
        return 'border-l-red-500 bg-red-500/5';
      default:
        return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className={`bg-[#1a1a1a] rounded-lg p-6 border border-gray-700 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">Loading market news...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#1a1a1a] rounded-lg p-6 border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Market News</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          title="Refresh news"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* News Articles */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {news.map((article) => (
          <div
            key={article.id}
            className={`border-l-4 rounded-r-lg p-4 transition-all hover:bg-gray-800/50 ${getSentimentColor(article.sentiment)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getSentimentIcon(article.sentiment)}
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                  {article.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(article.publishedAt)}
              </div>
            </div>
            
            <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2">
              {article.title}
            </h4>
            
            <p className="text-xs text-gray-300 mb-3 line-clamp-2">
              {article.summary}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{article.source}</span>
              <button
                onClick={() => window.open(article.url, '_blank')}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Read more
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          <span>Auto-refresh: 5m</span>
        </div>
      </div>
    </div>
  );
};

export default RealtimeMarketNews;


