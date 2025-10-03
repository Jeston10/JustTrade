'use client';

import { useState } from 'react';
import WatchlistButton from './WatchlistButton';

interface WatchlistButtonWrapperProps {
  symbol: string;
  company: string;
  isInWatchlist: boolean;
}

const WatchlistButtonWrapper = ({ symbol, company, isInWatchlist }: WatchlistButtonWrapperProps) => {
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist);
  const [loading, setLoading] = useState(false);

  const handleWatchlistChange = async (symbol: string, added: boolean) => {
    setLoading(true);
    try {
      const response = await fetch('/api/watchlist', {
        method: added ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, company })
      });

      if (response.ok) {
        setInWatchlist(added);
      } else {
        console.error('Failed to update watchlist');
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WatchlistButton
      symbol={symbol}
      company={company}
      isInWatchlist={inWatchlist}
      onWatchlistChange={handleWatchlistChange}
    />
  );
};

export default WatchlistButtonWrapper;
