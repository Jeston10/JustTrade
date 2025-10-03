'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function getUserWatchlist(email: string): Promise<WatchlistItem[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
    return items;
  } catch (err) {
    console.error('getUserWatchlist error:', err);
    return [];
  }
}

export async function addToWatchlist(email: string, symbol: string, company: string): Promise<{ success: boolean; message: string }> {
  if (!email || !symbol || !company) {
    return { success: false, message: 'Missing required fields' };
  }

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) {
      return { success: false, message: 'User ID not found' };
    }

    // Check if already in watchlist
    const existing = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });
    if (existing) {
      return { success: false, message: 'Already in watchlist' };
    }

    // Add to watchlist
    await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
      addedAt: new Date()
    });

    return { success: true, message: 'Added to watchlist' };
  } catch (err) {
    console.error('addToWatchlist error:', err);
    return { success: false, message: 'Failed to add to watchlist' };
  }
}