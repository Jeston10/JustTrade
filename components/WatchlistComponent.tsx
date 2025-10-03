'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import WatchlistButton from './WatchlistButton';
import { getStockQuote } from '@/lib/actions/finnhub.actions';

// Comprehensive logo mapping for all companies available in search
const getCompanyLogo = (symbol: string, companyName: string): string => {
  const logoMap: Record<string, string> = {
    // Technology Giants
    'AAPL': 'https://logo.clearbit.com/apple.com',
    'MSFT': 'https://logo.clearbit.com/microsoft.com',
    'GOOGL': 'https://logo.clearbit.com/google.com',
    'AMZN': 'https://logo.clearbit.com/amazon.com',
    'TSLA': 'https://logo.clearbit.com/tesla.com',
    'META': 'https://logo.clearbit.com/meta.com',
    'NVDA': 'https://logo.clearbit.com/nvidia.com',
    'NFLX': 'https://logo.clearbit.com/netflix.com',
    'ORCL': 'https://logo.clearbit.com/oracle.com',
    'CRM': 'https://logo.clearbit.com/salesforce.com',
    
    // Growing Tech Companies
    'ADBE': 'https://logo.clearbit.com/adobe.com',
    'INTC': 'https://logo.clearbit.com/intel.com',
    'AMD': 'https://logo.clearbit.com/amd.com',
    'PYPL': 'https://logo.clearbit.com/paypal.com',
    'UBER': 'https://logo.clearbit.com/uber.com',
    'ZOOM': 'https://logo.clearbit.com/zoom.us',
    'SPOT': 'https://logo.clearbit.com/spotify.com',
    'SQ': 'https://logo.clearbit.com/squareup.com',
    'SHOP': 'https://logo.clearbit.com/shopify.com',
    'ROKU': 'https://logo.clearbit.com/roku.com',
    
    // Financial Companies
    'JPM': 'https://logo.clearbit.com/jpmorganchase.com',
    'WFC': 'https://logo.clearbit.com/wellsfargo.com',
    'BAC': 'https://logo.clearbit.com/bankofamerica.com',
    'HSBC': 'https://logo.clearbit.com/hsbc.com',
    'C': 'https://logo.clearbit.com/citi.com',
    'MA': 'https://logo.clearbit.com/mastercard.com',
    'V': 'https://logo.clearbit.com/visa.com',
    'AXP': 'https://logo.clearbit.com/americanexpress.com',
    'GS': 'https://logo.clearbit.com/goldmansachs.com',
    'MS': 'https://logo.clearbit.com/morganstanley.com',
    
    // Consumer & Retail
    'WMT': 'https://logo.clearbit.com/walmart.com',
    'TGT': 'https://logo.clearbit.com/target.com',
    'HD': 'https://logo.clearbit.com/homedepot.com',
    'COST': 'https://logo.clearbit.com/costco.com',
    'LOW': 'https://logo.clearbit.com/lowes.com',
    'MCD': 'https://logo.clearbit.com/mcdonalds.com',
    'SBUX': 'https://logo.clearbit.com/starbucks.com',
    'NKE': 'https://logo.clearbit.com/nike.com',
    'DIS': 'https://logo.clearbit.com/disney.com',
    'CMCSA': 'https://logo.clearbit.com/comcast.com',
    
    // Healthcare & Pharma
    'JNJ': 'https://logo.clearbit.com/jnj.com',
    'PFE': 'https://logo.clearbit.com/pfizer.com',
    'UNH': 'https://logo.clearbit.com/unitedhealthgroup.com',
    'ABBV': 'https://logo.clearbit.com/abbvie.com',
    'MRK': 'https://logo.clearbit.com/merck.com',
    'TMO': 'https://logo.clearbit.com/thermofisher.com',
    'ABT': 'https://logo.clearbit.com/abbott.com',
    'DHR': 'https://logo.clearbit.com/danaher.com',
    'BMY': 'https://logo.clearbit.com/bms.com',
    'AMGN': 'https://logo.clearbit.com/amgen.com',
    
    // Energy & Utilities
    'XOM': 'https://logo.clearbit.com/exxonmobil.com',
    'CVX': 'https://logo.clearbit.com/chevron.com',
    'COP': 'https://logo.clearbit.com/conocophillips.com',
    'EOG': 'https://logo.clearbit.com/eogresources.com',
    'SLB': 'https://logo.clearbit.com/slb.com',
    'OXY': 'https://logo.clearbit.com/oxy.com',
    'KMI': 'https://logo.clearbit.com/kindermorgan.com',
    'WMB': 'https://logo.clearbit.com/williams.com',
    'PSX': 'https://logo.clearbit.com/phillips66.com',
    'VLO': 'https://logo.clearbit.com/valero.com',
    
    // Industrial & Materials
    'BA': 'https://logo.clearbit.com/boeing.com',
    'CAT': 'https://logo.clearbit.com/caterpillar.com',
    'GE': 'https://logo.clearbit.com/ge.com',
    'HON': 'https://logo.clearbit.com/honeywell.com',
    'MMM': 'https://logo.clearbit.com/3m.com',
    'UPS': 'https://logo.clearbit.com/ups.com',
    'FDX': 'https://logo.clearbit.com/fedex.com',
    'LMT': 'https://logo.clearbit.com/lockheedmartin.com',
    'RTX': 'https://logo.clearbit.com/raytheon.com',
    'NOC': 'https://logo.clearbit.com/northropgrumman.com',
    
    // Communication Services
    'T': 'https://logo.clearbit.com/att.com',
    'VZ': 'https://logo.clearbit.com/verizon.com',
    'TMUS': 'https://logo.clearbit.com/t-mobile.com',
    'CHTR': 'https://logo.clearbit.com/charter.com',
    'CMCSA': 'https://logo.clearbit.com/comcast.com',
    'DIS': 'https://logo.clearbit.com/disney.com',
    'NFLX': 'https://logo.clearbit.com/netflix.com',
    'GOOGL': 'https://logo.clearbit.com/google.com',
    'META': 'https://logo.clearbit.com/meta.com',
    'TWTR': 'https://logo.clearbit.com/twitter.com',
    
    // ETFs and Indices
    'SPY': 'https://logo.clearbit.com/spdrs.com',
    'QQQ': 'https://logo.clearbit.com/invesco.com',
    'IWM': 'https://logo.clearbit.com/ishares.com',
    'GLD': 'https://logo.clearbit.com/spdrs.com',
    'TLT': 'https://logo.clearbit.com/ishares.com',
    'DIA': 'https://logo.clearbit.com/spdrs.com',
    'EFA': 'https://logo.clearbit.com/ishares.com',
    'VTI': 'https://logo.clearbit.com/vanguard.com',
    'VOO': 'https://logo.clearbit.com/vanguard.com',
    'VEA': 'https://logo.clearbit.com/vanguard.com',
    
    // International Companies
    'BABA': 'https://logo.clearbit.com/alibaba.com',
    'JD': 'https://logo.clearbit.com/jd.com',
    'PDD': 'https://logo.clearbit.com/pinduoduo.com',
    'TME': 'https://logo.clearbit.com/tencentmusic.com',
    'BILI': 'https://logo.clearbit.com/bilibili.com',
    'NIO': 'https://logo.clearbit.com/nio.com',
    'XPEV': 'https://logo.clearbit.com/xpeng.com',
    'LI': 'https://logo.clearbit.com/lixiang.com',
    'GRAB': 'https://logo.clearbit.com/grab.com',
    'SE': 'https://logo.clearbit.com/sea.com',
  };

  // Try exact symbol match first
  if (logoMap[symbol]) {
    return logoMap[symbol];
  }

  // Try to extract company name and map to domain
  const companyLower = companyName.toLowerCase();
  
  // Common mappings for company names to domains
  const nameMappings: Record<string, string> = {
    'apple': 'apple.com',
    'microsoft': 'microsoft.com',
    'google': 'google.com',
    'alphabet': 'google.com',
    'amazon': 'amazon.com',
    'tesla': 'tesla.com',
    'meta': 'meta.com',
    'facebook': 'meta.com',
    'nvidia': 'nvidia.com',
    'netflix': 'netflix.com',
    'oracle': 'oracle.com',
    'salesforce': 'salesforce.com',
    'adobe': 'adobe.com',
    'intel': 'intel.com',
    'amd': 'amd.com',
    'paypal': 'paypal.com',
    'uber': 'uber.com',
    'zoom': 'zoom.us',
    'spotify': 'spotify.com',
    'square': 'squareup.com',
    'shopify': 'shopify.com',
    'roku': 'roku.com',
    'jpmorgan': 'jpmorganchase.com',
    'wells fargo': 'wellsfargo.com',
    'bank of america': 'bankofamerica.com',
    'citigroup': 'citi.com',
    'mastercard': 'mastercard.com',
    'visa': 'visa.com',
    'walmart': 'walmart.com',
    'target': 'target.com',
    'home depot': 'homedepot.com',
    'costco': 'costco.com',
    'lowes': 'lowes.com',
    'mcdonalds': 'mcdonalds.com',
    'starbucks': 'starbucks.com',
    'nike': 'nike.com',
    'disney': 'disney.com',
    'comcast': 'comcast.com',
    'johnson & johnson': 'jnj.com',
    'pfizer': 'pfizer.com',
    'unitedhealth': 'unitedhealthgroup.com',
    'abbvie': 'abbvie.com',
    'merck': 'merck.com',
    'thermo fisher': 'thermofisher.com',
    'abbott': 'abbott.com',
    'danaher': 'danaher.com',
    'bristol myers': 'bms.com',
    'amgen': 'amgen.com',
    'exxon': 'exxonmobil.com',
    'chevron': 'chevron.com',
    'conoco': 'conocophillips.com',
    'schlumberger': 'slb.com',
    'boeing': 'boeing.com',
    'caterpillar': 'caterpillar.com',
    'general electric': 'ge.com',
    'honeywell': 'honeywell.com',
    '3m': '3m.com',
    'ups': 'ups.com',
    'fedex': 'fedex.com',
    'lockheed': 'lockheedmartin.com',
    'raytheon': 'raytheon.com',
    'northrop': 'northropgrumman.com',
    'at&t': 'att.com',
    'verizon': 'verizon.com',
    't-mobile': 't-mobile.com',
    'charter': 'charter.com',
    'twitter': 'twitter.com',
    'alibaba': 'alibaba.com',
    'jd.com': 'jd.com',
    'pinduoduo': 'pinduoduo.com',
    'tencent': 'tencentmusic.com',
    'bilibili': 'bilibili.com',
    'nio': 'nio.com',
    'xpeng': 'xpeng.com',
    'li auto': 'lixiang.com',
    'grab': 'grab.com',
    'sea': 'sea.com',
  };

  // Try to find a match in company name
  for (const [key, domain] of Object.entries(nameMappings)) {
    if (companyLower.includes(key)) {
      return `https://logo.clearbit.com/${domain}`;
    }
  }

  // Fallback to symbol-based approach
  return `https://logo.clearbit.com/${symbol.toLowerCase()}.com`;
};

interface WatchlistItem {
  _id: string;
  userId: string;
  symbol: string;
  company: string;
  addedAt: string;
}

interface StockQuote {
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

interface WatchlistComponentProps {
  initialWatchlist: WatchlistItem[];
  userEmail: string;
}

const WatchlistComponent = ({ initialWatchlist, userEmail }: WatchlistComponentProps) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(initialWatchlist);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [stockQuotes, setStockQuotes] = useState<Record<string, StockQuote>>({});
  const [quotesLoading, setQuotesLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch real-time stock quotes
  useEffect(() => {
    if (!isClient || watchlist.length === 0) return;

    const fetchQuotes = async () => {
      setQuotesLoading(true);
      try {
        const quotes: Record<string, StockQuote> = {};
        
        // Fetch quotes for all watchlist items
        await Promise.all(
          watchlist.map(async (item) => {
            try {
              const quote = await getStockQuote(item.symbol);
              if (quote) {
                quotes[item.symbol] = quote;
              }
            } catch (error) {
              console.error(`Error fetching quote for ${item.symbol}:`, error);
            }
          })
        );
        
        setStockQuotes(quotes);
      } catch (error) {
        console.error('Error fetching stock quotes:', error);
      } finally {
        setQuotesLoading(false);
      }
    };

    fetchQuotes();

    // Refresh quotes every 30 seconds
    const interval = setInterval(fetchQuotes, 30000);
    return () => clearInterval(interval);
  }, [isClient, watchlist]);

  const handleRemoveFromWatchlist = async (symbol: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol }),
      });

      if (response.ok) {
        setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    } finally {
      setLoading(false);
    }
  };


  if (watchlist.length === 0) {
    return (
      <motion.div
        className="w-full text-center py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">Your Watchlist is Empty</h3>
          <p className="text-sm">Add companies to your watchlist by searching and clicking the star icon</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.map((item, index) => {
          const quote = stockQuotes[item.symbol];
          const isPositive = quote ? quote.change >= 0 : false;
          
          return (
            <motion.div
              key={item._id}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Bookmark Icon */}
              <div className="absolute top-2 right-2">
                <WatchlistButton
                  symbol={item.symbol}
                  company={item.company}
                  isInWatchlist={true}
                  showTrashIcon={true}
                  type="icon"
                  onWatchlistChange={(symbol) => handleRemoveFromWatchlist(symbol)}
                />
              </div>

              <Link 
                href={`/stocks/${item.symbol}`}
                className="block hover:text-yellow-400 transition-colors"
              >
                {/* Company Logo */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center mb-3">
                  <img 
                    src={getCompanyLogo(item.symbol, item.company)}
                    alt={`${item.company} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-white font-bold text-sm">${item.symbol}</span>`;
                        parent.className = "w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm";
                      }
                    }}
                  />
                </div>

                {/* Company Name */}
                <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-yellow-400 transition-colors">
                  {item.company}
                </h3>

                {/* Current Price */}
                <div className="text-white font-bold text-lg mb-1">
                  {isClient && quote ? `$${quote.currentPrice.toFixed(2)}` : 
                   quotesLoading ? 'Loading...' : 'N/A'}
                </div>

                {/* Daily Change */}
                <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isClient && quote ? (
                    <>
                      {isPositive ? '+' : ''}{quote.change.toFixed(2)} ({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)
                    </>
                  ) : quotesLoading ? (
                    'Loading...'
                  ) : (
                    'N/A'
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WatchlistComponent;