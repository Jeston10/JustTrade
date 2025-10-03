import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { symbol, company } = await request.json();
    
    if (!symbol || !company) {
      return NextResponse.json({ error: 'Symbol and company are required' }, { status: 400 });
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 404 });
    }

    // Check if already in watchlist
    const existing = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });
    if (existing) {
      return NextResponse.json({ error: 'Already in watchlist' }, { status: 409 });
    }

    // Add to watchlist
    await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
      addedAt: new Date()
    });

    return NextResponse.json({ success: true, message: 'Added to watchlist' });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { symbol } = await request.json();
    
    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 404 });
    }

    // Remove the item from watchlist
    const result = await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Item not found in watchlist' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Item removed from watchlist' });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
