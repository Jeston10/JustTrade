import { getStockQuote } from '@/lib/actions/finnhub.actions';

export interface MarketIndex {
  symbol: string;
  name: string;
  value: string;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface SectorPerformance {
  symbol: string;
  name: string;
  value: string;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
}

// Major market indices symbols
const MARKET_INDICES = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'QQQ', name: 'NASDAQ' },
  { symbol: 'DIA', name: 'DOW JONES' },
  { symbol: 'VIX', name: 'VOLATILITY' },
  { symbol: 'SPY', name: 'TOTAL VOLUME' }, // Using SPY for volume data
  { symbol: 'ACWI', name: 'GLOBAL MARKETS' }
];

// Sector ETF symbols for sector performance
const SECTOR_ETFS = [
  { symbol: 'XLK', name: 'Technology' },
  { symbol: 'XLV', name: 'Healthcare' },
  { symbol: 'XLF', name: 'Financial' },
  { symbol: 'XLE', name: 'Energy' },
  { symbol: 'XLY', name: 'Consumer' },
  { symbol: 'XLI', name: 'Industrial' }
];

export async function getMarketIndicesData(): Promise<MarketIndex[]> {
  try {
    const promises = MARKET_INDICES.map(async (index) => {
      try {
        const quote = await getStockQuote(index.symbol);
        
        if (!quote) {
          // Return mock data if API fails
          const mockPrice = Math.random() * 1000 + 100;
          const mockChange = (Math.random() - 0.5) * 20;
          const mockChangePercent = (mockChange / mockPrice) * 100;
          
          return {
            symbol: index.symbol,
            name: index.name,
            value: mockPrice.toFixed(2),
            change: mockChange,
            changePercent: mockChangePercent,
            trend: mockChange >= 0 ? 'up' : 'down'
          };
        }

        const currentPrice = quote.currentPrice || 0;
        const previousClose = quote.previousClose || currentPrice;
        const change = quote.change || 0;
        const changePercent = quote.changePercent || 0;
        
        // Special handling for VIX (volatility index)
        if (index.symbol === 'VIX') {
          return {
            symbol: index.symbol,
            name: index.name,
            value: currentPrice.toFixed(2),
            change: change,
            changePercent: changePercent,
            trend: change >= 0 ? 'up' : 'down'
          };
        }

        // Special handling for TOTAL VOLUME (using SPY volume)
        if (index.name === 'TOTAL VOLUME') {
          // For volume, we'll use a mock value since Finnhub doesn't provide volume in the quote
          const volumeInBillions = (Math.random() * 5 + 1).toFixed(1); // Random between 1-6B
          return {
            symbol: index.symbol,
            name: index.name,
            value: `${volumeInBillions}B`,
            change: 0,
            changePercent: 0,
            trend: 'neutral' as const
          };
        }

        // Special handling for GLOBAL MARKETS
        if (index.name === 'GLOBAL MARKETS') {
          return {
            symbol: index.symbol,
            name: index.name,
            value: 'ACTIVE',
            change: 0,
            changePercent: 0,
            trend: 'neutral' as const
          };
        }

        return {
          symbol: index.symbol,
          name: index.name,
          value: currentPrice.toFixed(2),
          change: change,
          changePercent: changePercent,
          trend: change >= 0 ? 'up' : 'down'
        };
      } catch (error) {
        console.error(`Error fetching data for ${index.symbol}:`, error);
        // Return mock data on error
        const mockPrice = Math.random() * 1000 + 100;
        const mockChange = (Math.random() - 0.5) * 20;
        const mockChangePercent = (mockChange / mockPrice) * 100;
        
        return {
          symbol: index.symbol,
          name: index.name,
          value: mockPrice.toFixed(2),
          change: mockChange,
          changePercent: mockChangePercent,
          trend: mockChange >= 0 ? 'up' : 'down'
        };
      }
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error fetching market indices data:', error);
    return MARKET_INDICES.map(index => {
      const mockPrice = Math.random() * 1000 + 100;
      const mockChange = (Math.random() - 0.5) * 20;
      const mockChangePercent = (mockChange / mockPrice) * 100;
      
      return {
        symbol: index.symbol,
        name: index.name,
        value: mockPrice.toFixed(2),
        change: mockChange,
        changePercent: mockChangePercent,
        trend: mockChange >= 0 ? 'up' : 'down'
      };
    });
  }
}

export async function getSectorPerformanceData(): Promise<SectorPerformance[]> {
  try {
    const promises = SECTOR_ETFS.map(async (sector) => {
      try {
        const quote = await getStockQuote(sector.symbol);
        
        if (!quote) {
          // Return mock data if API fails
          const mockChangePercent = (Math.random() - 0.5) * 4; // -2% to +2%
          const mockChange = mockChangePercent * 10;
          
          return {
            symbol: sector.symbol,
            name: sector.name,
            value: `${mockChangePercent.toFixed(2)}%`,
            change: mockChange,
            changePercent: mockChangePercent,
            trend: mockChangePercent >= 0 ? 'up' : 'down'
          };
        }

        const currentPrice = quote.currentPrice || 0;
        const previousClose = quote.previousClose || currentPrice;
        const change = quote.change || 0;
        const changePercent = quote.changePercent || 0;

        return {
          symbol: sector.symbol,
          name: sector.name,
          value: `${changePercent.toFixed(2)}%`,
          change: change,
          changePercent: changePercent,
          trend: change >= 0 ? 'up' : 'down'
        };
      } catch (error) {
        console.error(`Error fetching data for ${sector.symbol}:`, error);
        // Return mock data on error
        const mockChangePercent = (Math.random() - 0.5) * 4; // -2% to +2%
        const mockChange = mockChangePercent * 10;
        
        return {
          symbol: sector.symbol,
          name: sector.name,
          value: `${mockChangePercent.toFixed(2)}%`,
          change: mockChange,
          changePercent: mockChangePercent,
          trend: mockChangePercent >= 0 ? 'up' : 'down'
        };
      }
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error fetching sector performance data:', error);
    return SECTOR_ETFS.map(sector => {
      const mockChangePercent = (Math.random() - 0.5) * 4; // -2% to +2%
      const mockChange = mockChangePercent * 10;
      
      return {
        symbol: sector.symbol,
        name: sector.name,
        value: `${mockChangePercent.toFixed(2)}%`,
        change: mockChange,
        changePercent: mockChangePercent,
        trend: mockChangePercent >= 0 ? 'up' : 'down'
      };
    });
  }
}
