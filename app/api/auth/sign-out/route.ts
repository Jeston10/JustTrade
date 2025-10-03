import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@/lib/better-auth/auth'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const authInstance = await getAuth()
    const session = await authInstance.api.getSession({ headers: await headers() })
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Sign out the user using Better Auth
    await authInstance.api.signOut({ 
      headers: await headers() 
    })

    // Create response with proper headers to clear cookies
    const response = NextResponse.json({ 
      message: 'Successfully logged out',
      success: true 
    })

    // Clear any auth-related cookies
    response.cookies.delete('better-auth.session_token')
    response.cookies.delete('better-auth.csrf_token')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: `Failed to logout: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
      { status: 500 }
    )
  }
}
