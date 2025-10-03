'use server';

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
import {headers} from "next/headers";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({ body: { email, password, name: fullName } })

        if(response) {
            await inngest.send({
                name: 'app/user.created',
                data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
            })
        }

        return { success: true, data: response }
    } catch (e: any) {
        console.log('Sign up failed', e)
        
        // Handle specific error types
        if (e?.message?.includes('already exists') || e?.message?.includes('duplicate')) {
            return { success: false, error: 'An account with this email already exists. Please sign in instead.' }
        }
        
        if (e?.status === 'BAD_REQUEST' || e?.statusCode === 400) {
            return { success: false, error: 'Invalid information provided. Please check your details and try again.' }
        }
        
        return { success: false, error: 'Sign up failed. Please try again.' }
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({ body: { email, password } })

        return { success: true, data: response }
    } catch (e: any) {
        console.log('Sign in failed', e)
        
        // Handle specific error types
        if (e?.status === 'UNAUTHORIZED' || e?.statusCode === 401) {
            return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' }
        }
        
        if (e?.message?.includes('User not found')) {
            return { success: false, error: 'No account found with this email. Please sign up first.' }
        }
        
        return { success: false, error: 'Sign in failed. Please try again.' }
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
    } catch (e) {
        console.log('Sign out failed', e)
        return { success: false, error: 'Sign out failed' }
    }
}
