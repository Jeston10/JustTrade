'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/constants'
import SearchCommand from '@/components/SearchCommand'
import { 
  Home, 
  BarChart3, 
  PieChart, 
  Flame, 
  Search, 
  User,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { toast } from 'sonner'

interface SidebarProps {
  initialStocks: StockWithWatchlistStatus[]
}

const Sidebar = ({ initialStocks }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/sign-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('Successfully logged out')
        // Clear any local storage or session data
        localStorage.clear()
        sessionStorage.clear()
        // Redirect to sign-in page
        window.location.href = '/sign-in'
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to logout. Please try again.')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('An unexpected error occurred during logout.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getIcon = (href: string) => {
    switch (href) {
      case '/':
        return Home
      case '/dashboard':
        return BarChart3
      case '/market-overview':
        return PieChart
      case '/heatmap':
        return Flame
      case '/search':
        return Search
      case '/profile':
        return User
      default:
        return Home
    }
  }

  return (
    <>
      {/* Hover Trigger Area */}
      <div 
        className="fixed left-0 top-0 h-full w-4 z-40 hover:bg-transparent group"
        onMouseEnter={() => setIsOpen(true)}
      >
        {/* Visual indicator */}
        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-yellow-400/30 rounded-full group-hover:bg-yellow-400/60 transition-all duration-300" />
      </div>
      
      {/* Sidebar */}
      <div 
        data-sidebar
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 transition-all duration-300 z-50 overflow-hidden ${
          isOpen ? 'w-64' : 'w-0 opacity-0'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-gray-900" />
            </div>
            {isOpen && (
              <span className="text-white text-xl font-bold">JustTrade</span>
            )}
          </Link>
          {/* Close button for mobile */}
          <button 
            className="lg:hidden p-1 rounded text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {NAV_ITEMS.map(({ href, label }) => {
            const Icon = getIcon(href)
            const active = isActive(href)

            if (href === '/search') {
              return (
                <div key="search-trigger" className="relative">
                  <SearchCommand
                    renderAs="sidebar"
                    label="Search"
                    initialStocks={initialStocks}
                    isOpen={isOpen}
                  />
                </div>
              )
            }

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-yellow-400' : 'text-gray-400 group-hover:text-white'}`} />
                {isOpen && (
                  <span className="text-sm font-medium">{label}</span>
                )}
                {isOpen && (
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 space-y-3">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300 ${
              isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <LogOut className="w-5 h-5" />
            {isOpen && (
              <span className="text-sm font-medium">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            )}
          </button>

          {/* Live Market Data Status */}
          <div className="flex items-center space-x-3 text-gray-400 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            {isOpen && <span>Live Market Data</span>}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
