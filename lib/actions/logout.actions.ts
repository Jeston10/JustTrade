'use server'

import { auth } from '@/lib/better-auth/auth'
import { headers } from 'next/headers'

export async function logout() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (!session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Sign out the user
    const result = await auth.api.signOut({ headers: await headers() })
    
    return { success: true, data: result }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: 'Failed to logout' }
  }
}
