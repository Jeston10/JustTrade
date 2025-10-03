'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import { searchStocks } from '@/lib/actions/finnhub.actions'
import { useEffect } from 'react'

interface AppLayoutProps {
  children: React.ReactNode
  user: User
}

const AppLayout = ({ children, user }: AppLayoutProps) => {
  const [initialStocks, setInitialStocks] = useState<StockWithWatchlistStatus[]>([])

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stocks = await searchStocks()
        setInitialStocks(stocks)
      } catch (error) {
        console.error('Failed to fetch initial stocks:', error)
      }
    }
    fetchStocks()
  }, [])

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar initialStocks={initialStocks} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-gray-800/50 border-b border-gray-700 px-6 py-4 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              onClick={() => {
                const sidebar = document.querySelector('[data-sidebar]') as HTMLElement;
                if (sidebar) {
                  sidebar.style.width = '16rem';
                  sidebar.style.opacity = '1';
                }
              }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-white">JustTrade</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Market Data</span>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout
