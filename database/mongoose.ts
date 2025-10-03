import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if(!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if(!MONGODB_URI) {
        console.warn('MONGODB_URI not set, skipping database connection');
        return null;
    }

    // Skip database connection during build time or when running in build context
    if(process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        console.log('Database connection skipped during build phase');
        return null;
    }

    // Also skip during static generation
    if(typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
        // Check if we're in a build context by looking for build-specific environment variables
        if(process.env.NEXT_PHASE || process.env.BUILD_ID) {
            console.log('Database connection skipped during build phase');
            return null;
        }
    }

    if(cached.conn) return cached.conn;

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { 
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log(`Connected to database ${process.env.NODE_ENV}`);
    } catch (err) {
        cached.promise = null;
        console.error('Database connection error:', err);
        throw err;
    }

    return cached.conn;
}
