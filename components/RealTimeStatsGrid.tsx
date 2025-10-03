'use client'

import { useState, useEffect } from 'react'
import StatsGrid from './ui/StatsGrid'
import { getMarketIndicesData, getSectorPerformanceData, MarketIndex, SectorPerformance } from '@/lib/services/market-data.service'
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Globe } from 'lucide-react'

interface RealTimeStatsGridProps {
  type: 'market' | 'sector'
  initialData: any[]
}

const RealTimeStatsGrid = ({ type, initialData }: RealTimeStatsGridProps) => {
  const [data, setData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        let newData: MarketIndex[] | SectorPerformance[]
        
        if (type === 'market') {
          newData = await getMarketIndicesData()
        } else {
          newData = await getSectorPerformanceData()
        }

        // Map to StatsGrid format
        const mappedData = newData.map((item, idx) => {
          const icons = [
            <TrendingUp className="w-4 h-4" />,
            <TrendingDown className="w-4 h-4" />,
            <BarChart3 className="w-4 h-4" />,
            <Activity className="w-4 h-4" />,
            <DollarSign className="w-4 h-4" />,
            <Globe className="w-4 h-4" />
          ]

          return {
            label: item.name,
            value: item.value,
            change: item.change,
            changePercent: item.changePercent,
            trend: item.trend,
            icon: icons[idx] || <BarChart3 className="w-4 h-4" />
          }
        })

        setData(mappedData)
      } catch (error) {
        console.error('Error fetching real-time data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Fetch data every 30 seconds
    const interval = setInterval(fetchData, 30000)

    return () => clearInterval(interval)
  }, [type])

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      )}
      <StatsGrid stats={data} columns={6} />
    </div>
  )
}

export default RealTimeStatsGrid
