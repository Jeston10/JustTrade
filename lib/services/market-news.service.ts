import axios from 'axios';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  category: string;
}

export interface MarketNewsResponse {
  articles: NewsArticle[];
  total: number;
  lastUpdate: string;
}

// Mock news data for when API is not available
const mockNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'Stock Market Shows Strong Performance in Q4',
    summary: 'Major indices continue to rally as investors show confidence in economic recovery.',
    url: '#',
    publishedAt: new Date().toISOString(),
    source: 'Financial Times',
    sentiment: 'positive',
    category: 'Market'
  },
  {
    id: '2',
    title: 'Technology Sector Leads Market Gains',
    summary: 'Tech stocks surge as AI and cloud computing drive investor interest.',
    url: '#',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: 'Reuters',
    sentiment: 'positive',
    category: 'Technology'
  },
  {
    id: '3',
    title: 'Federal Reserve Maintains Interest Rates',
    summary: 'Central bank keeps rates steady amid inflation concerns and economic uncertainty.',
    url: '#',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: 'Bloomberg',
    sentiment: 'neutral',
    category: 'Economy'
  },
  {
    id: '4',
    title: 'Energy Sector Faces Volatility',
    summary: 'Oil prices fluctuate as supply concerns and demand patterns shift.',
    url: '#',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: 'MarketWatch',
    sentiment: 'negative',
    category: 'Energy'
  },
  {
    id: '5',
    title: 'Cryptocurrency Market Shows Mixed Signals',
    summary: 'Bitcoin and altcoins experience varying trends as regulatory clarity emerges.',
    url: '#',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    source: 'CoinDesk',
    sentiment: 'neutral',
    category: 'Crypto'
  }
];

export async function getMarketNews(limit: number = 10): Promise<MarketNewsResponse> {
  try {
    // Try to fetch from a real news API (you can replace with actual API)
    // For now, we'll use mock data but structure it for real API integration
    
    // Example API call (uncomment and configure when you have a real API key):
    /*
    const response = await axios.get('https://api.example.com/news', {
      params: {
        category: 'business',
        limit: limit,
        api_key: process.env.NEWS_API_KEY
      },
      timeout: 5000
    });
    
    const articles = response.data.articles.map((article: any) => ({
      id: article.id || Math.random().toString(),
      title: article.title,
      summary: article.description || article.summary,
      url: article.url,
      publishedAt: article.publishedAt || article.published_at,
      source: article.source?.name || 'Unknown',
      sentiment: analyzeSentiment(article.title + ' ' + article.description),
      category: article.category || 'General'
    }));
    */

    // For now, return mock data with some randomization
    const shuffledNews = [...mockNewsData].sort(() => Math.random() - 0.5);
    const selectedNews = shuffledNews.slice(0, limit);

    return {
      articles: selectedNews,
      total: mockNewsData.length,
      lastUpdate: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error fetching market news:', error);
    
    // Return mock data as fallback
    return {
      articles: mockNewsData.slice(0, limit),
      total: mockNewsData.length,
      lastUpdate: new Date().toISOString()
    };
  }
}

export async function getNewsByCategory(category: string, limit: number = 5): Promise<NewsArticle[]> {
  try {
    const allNews = await getMarketNews(50);
    return allNews.articles
      .filter(article => article.category.toLowerCase() === category.toLowerCase())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching news by category:', error);
    return mockNewsData
      .filter(article => article.category.toLowerCase() === category.toLowerCase())
      .slice(0, limit);
  }
}

export async function getLatestMarketNews(): Promise<NewsArticle[]> {
  try {
    const response = await getMarketNews(5);
    return response.articles;
  } catch (error) {
    console.error('Error fetching latest market news:', error);
    return mockNewsData.slice(0, 5);
  }
}

// Simple sentiment analysis function (you can replace with a real sentiment analysis API)
function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['gain', 'rise', 'surge', 'rally', 'strong', 'positive', 'growth', 'increase', 'up', 'bullish'];
  const negativeWords = ['fall', 'drop', 'decline', 'crash', 'weak', 'negative', 'loss', 'decrease', 'down', 'bearish'];
  
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}


