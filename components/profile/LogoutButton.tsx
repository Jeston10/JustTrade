'use client'

import { useState } from 'react'
import { LogOut, AlertTriangle } from 'lucide-react'
import { logout } from '@/lib/actions/logout.actions'
import { toast } from 'sonner'

interface LogoutButtonProps {
  user: User
}

const LogoutButton = ({ user }: LogoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      toast.success('Successfully logged out')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout. Please try again.')
    } finally {
      setIsLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="space-y-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Confirm Logout</span>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            Are you sure you want to logout? You'll need to sign in again to access your account.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              {isLoading ? 'Logging out...' : 'Yes, Logout'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 text-white text-sm rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-4 border border-gray-600/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-1">Account Actions</h3>
            <p className="text-sm text-gray-400">
              Sign out of your account to secure your session
            </p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-red-500/25"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutButton
