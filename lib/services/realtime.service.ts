import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

export interface RealtimeData {
  type: 'stock_update' | 'price_alert' | 'news_alert' | 'profile_update' | 'system_message';
  userId?: string;
  symbol?: string;
  data: any;
  timestamp: Date;
}

export interface StockUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface PriceAlert {
  symbol: string;
  currentPrice: number;
  targetPrice: number;
  alertType: 'price_above' | 'price_below' | 'volume_spike' | 'news_alert';
  message: string;
}

export class RealtimeService {
  private static io: SocketIOServer | null = null;
  private static connectedUsers: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

  // Initialize Socket.IO server
  static initialize(server: HTTPServer): SocketIOServer {
    if (this.io) {
      return this.io;
    }

    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join user to their personal room
      socket.on('join_user_room', (userId: string) => {
        socket.join(`user_${userId}`);
        if (!this.connectedUsers.has(userId)) {
          this.connectedUsers.set(userId, new Set());
        }
        this.connectedUsers.get(userId)?.add(socket.id);
        console.log(`User ${userId} joined their room`);
      });

      // Join user to stock-specific rooms
      socket.on('join_stock_room', (symbol: string) => {
        socket.join(`stock_${symbol}`);
        console.log(`User joined stock room: ${symbol}`);
      });

      // Leave stock room
      socket.on('leave_stock_room', (symbol: string) => {
        socket.leave(`stock_${symbol}`);
        console.log(`User left stock room: ${symbol}`);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        
        // Remove socket from connected users
        for (const [userId, socketIds] of this.connectedUsers.entries()) {
          if (socketIds.has(socket.id)) {
            socketIds.delete(socket.id);
            if (socketIds.size === 0) {
              this.connectedUsers.delete(userId);
            }
            break;
          }
        }
      });

      // Handle custom events
      socket.on('stock_subscribe', (data: { symbol: string; userId: string }) => {
        socket.join(`stock_${data.symbol}`);
        socket.join(`user_${data.userId}`);
        console.log(`User ${data.userId} subscribed to ${data.symbol}`);
      });

      socket.on('stock_unsubscribe', (data: { symbol: string; userId: string }) => {
        socket.leave(`stock_${data.symbol}`);
        console.log(`User ${data.userId} unsubscribed from ${data.symbol}`);
      });
    });

    return this.io;
  }

  // Get Socket.IO instance
  static getIO(): SocketIOServer | null {
    return this.io;
  }

  // Send data to specific user
  static sendToUser(userId: string, data: RealtimeData): boolean {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return false;
    }

    try {
      this.io.to(`user_${userId}`).emit('realtime_update', data);
      return true;
    } catch (error) {
      console.error('Error sending to user:', error);
      return false;
    }
  }

  // Send data to all users watching a specific stock
  static sendToStockWatchers(symbol: string, data: RealtimeData): boolean {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return false;
    }

    try {
      this.io.to(`stock_${symbol}`).emit('stock_update', data);
      return true;
    } catch (error) {
      console.error('Error sending to stock watchers:', error);
      return false;
    }
  }

  // Broadcast to all connected users
  static broadcast(data: RealtimeData): boolean {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return false;
    }

    try {
      this.io.emit('broadcast_update', data);
      return true;
    } catch (error) {
      console.error('Error broadcasting:', error);
      return false;
    }
  }

  // Send stock price update
  static sendStockUpdate(symbol: string, update: StockUpdate): boolean {
    const data: RealtimeData = {
      type: 'stock_update',
      symbol,
      data: update,
      timestamp: new Date(),
    };

    return this.sendToStockWatchers(symbol, data);
  }

  // Send price alert
  static sendPriceAlert(userId: string, alert: PriceAlert): boolean {
    const data: RealtimeData = {
      type: 'price_alert',
      userId,
      symbol: alert.symbol,
      data: alert,
      timestamp: new Date(),
    };

    return this.sendToUser(userId, data);
  }

  // Send news alert
  static sendNewsAlert(symbol: string, news: any): boolean {
    const data: RealtimeData = {
      type: 'news_alert',
      symbol,
      data: news,
      timestamp: new Date(),
    };

    return this.sendToStockWatchers(symbol, data);
  }

  // Send profile update notification
  static sendProfileUpdate(userId: string, update: any): boolean {
    const data: RealtimeData = {
      type: 'profile_update',
      userId,
      data: update,
      timestamp: new Date(),
    };

    return this.sendToUser(userId, data);
  }

  // Send system message
  static sendSystemMessage(message: string, userId?: string): boolean {
    const data: RealtimeData = {
      type: 'system_message',
      userId,
      data: { message },
      timestamp: new Date(),
    };

    if (userId) {
      return this.sendToUser(userId, data);
    } else {
      return this.broadcast(data);
    }
  }

  // Get connected users count
  static getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get users watching specific stock
  static getStockWatchersCount(symbol: string): number {
    if (!this.io) {
      return 0;
    }

    const room = this.io.sockets.adapter.rooms.get(`stock_${symbol}`);
    return room ? room.size : 0;
  }

  // Check if user is online
  static isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId) && this.connectedUsers.get(userId)!.size > 0;
  }
}

// Client-side hook for real-time updates
export const useRealtime = () => {
  const connect = (userId: string) => {
    // This will be implemented in the client component
    console.log('Connecting to real-time service for user:', userId);
  };

  const subscribeToStock = (symbol: string, userId: string) => {
    console.log('Subscribing to stock:', symbol, 'for user:', userId);
  };

  const unsubscribeFromStock = (symbol: string, userId: string) => {
    console.log('Unsubscribing from stock:', symbol, 'for user:', userId);
  };

  return {
    connect,
    subscribeToStock,
    unsubscribeFromStock,
  };
};
