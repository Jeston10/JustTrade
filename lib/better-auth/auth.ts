import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectToDatabase} from "@/database/mongoose";
import { nextCookies} from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if(authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if(!db) throw new Error('MongoDB connection not found');

    authInstance = betterAuth({
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });

    return authInstance;
}

const getAuthInstance = async () => {
    if (!authInstance) {
        authInstance = await getAuth();
    }
    return authInstance;
};

export const auth = {
    api: {
        getSession: async (options: any) => {
            const instance = await getAuthInstance();
            return instance.api.getSession(options);
        },
        signInEmail: async (options: any) => {
            const instance = await getAuthInstance();
            return instance.api.signInEmail(options);
        },
        signUpEmail: async (options: any) => {
            const instance = await getAuthInstance();
            return instance.api.signUpEmail(options);
        },
        signOut: async (options: any) => {
            const instance = await getAuthInstance();
            return instance.api.signOut(options);
        }
    }
};
