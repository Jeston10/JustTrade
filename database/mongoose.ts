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
    if(!MONGODB_URI) throw new Error('MONGODB_URI must be set within .env');

    // Skip database connection during build time or when running in build context
    if(process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        throw new Error('Database connection skipped during build phase');
    }

    // Also skip during static generation
    if(typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
        // Check if we're in a build context by looking for build-specific environment variables
        if(process.env.NEXT_PHASE || process.env.BUILD_ID) {
            throw new Error('Database connection skipped during build phase');
        }
    }

    if(cached.conn) return cached.conn;

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    console.log(`Connected to database ${process.env.NODE_ENV} - ${MONGODB_URI}`);

    return cached.conn;
}
