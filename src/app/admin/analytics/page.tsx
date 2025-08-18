'use client'

import { useState, useEffect } from 'react'
import RequireRole from '@/components/RequireRole'

interface OverviewData {
  totalPageViews: number
  uniqueVisitors: number
  totalSessions: number
  averageSessionDuration: number
  topPages: { page: string, views: number }[]
  deviceBreakdown: { device: string, count: number }[]
  dailyStats: { date: string, views: number }[]
}

interface RealtimeData {
  activeVisitors: number
  recentPageViews: number
  topPagesNow: { page: string, views: number }[]
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null)
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
    
    // Fetch realtime data every 30 seconds
    const realtimeInterval = setInterval(fetchRealtimeData, 30000)
    fetchRealtimeData()
    
    return () => clearInterval(realtimeInterval)
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?type=overview&range=${timeRange}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      
      const data = await response.json()
      setOverviewData(data)
      setError(null)
    } catch (err) {
      setError('Failed to load analytics data')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRealtimeData = async () => {
    try {
      const response = await fetch('/api/analytics?type=realtime')
      if (!response.ok) throw new Error('Failed to fetch realtime data')
      
      const data = await response.json()
      setRealtimeData(data)
    } catch (err) {
      console.error('Realtime data fetch error:', err)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatPageName = (page: string) => {
    if (page === '/') return 'Homepage'
    if (page.startsWith('/berlin')) {
      if (page === '/berlin') return 'Berlin Overview'
      if (page.includes('/c/')) {
        const category = page.split('/c/')[1]
        return `Berlin - ${category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
      }
    }
    if (page.startsWith('/places/')) return 'Place Details'
    return page
  }

  return (
    <RequireRole roles={["ADMIN"]}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🐕 DogAtlas Analytics
            </h1>
            <p className="text-gray-600">
              Track how your dog-friendly platform is performing
            </p>
          </div>

          {/* Realtime Stats Bar */}
          {realtimeData && (
            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-700 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live Now
                </h2>
                <div className="flex space-x-6 text-sm">
                  <span className="text-gray-600">
                    <span className="font-semibold text-green-600">{realtimeData.activeVisitors}</span> active visitors
                  </span>
                  <span className="text-gray-600">
                    <span className="font-semibold text-blue-600">{realtimeData.recentPageViews}</span> views (last hour)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="border-b border-orange-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'pages', name: 'Pages', icon: '📄' },
                { id: 'places', name: 'Places', icon: '🏪' },
                { id: 'categories', name: 'Categories', icon: '🗂️' },
                { id: 'users', name: 'Users', icon: '👥' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Time Range Selector */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              {[
                { value: '1d', label: 'Last 24h' },
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last 90 days' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    timeRange === range.value
                      ? 'bg-orange-100 text-orange-700 border border-orange-300'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && overviewData && !loading && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Page Views"
                  value={overviewData.totalPageViews.toLocaleString()}
                  icon="👁️"
                  color="blue"
                />
                <MetricCard
                  title="Unique Visitors"
                  value={overviewData.uniqueVisitors.toLocaleString()}
                  icon="👤"
                  color="green"
                />
                <MetricCard
                  title="Total Sessions"
                  value={overviewData.totalSessions.toLocaleString()}
                  icon="⏱️"
                  color="purple"
                />
                <MetricCard
                  title="Avg. Session Duration"
                  value={formatDuration(overviewData.averageSessionDuration)}
                  icon="📊"
                  color="orange"
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📄 Top Pages
                  </h3>
                  <div className="space-y-3">
                    {overviewData.topPages.slice(0, 8).map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-400 w-4">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-900 truncate max-w-xs">
                            {formatPageName(page.page)}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-orange-600">
                          {page.views.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device Breakdown */}
                <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📱 Device Breakdown
                  </h3>
                  <div className="space-y-3">
                    {overviewData.deviceBreakdown.map((device) => {
                      const total = overviewData.deviceBreakdown.reduce((sum, d) => sum + d.count, 0)
                      const percentage = ((device.count / total) * 100).toFixed(1)
                      
                      return (
                        <div key={device.device} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">
                              {device.device === 'mobile' ? '📱' : 
                               device.device === 'tablet' ? '📟' : '💻'}
                            </span>
                            <span className="text-sm text-gray-900 capitalize">
                              {device.device}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`bg-orange-500 h-2 rounded-full`}
                                style={{width: `${percentage}%`}}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-orange-600 w-12">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Live Activity */}
              {realtimeData && (
                <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🔥 Trending Now (Last 24h)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {realtimeData.topPagesNow.map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatPageName(page.page)}
                          </p>
                          <p className="text-xs text-gray-600">
                            {page.views} views
                          </p>
                        </div>
                        <span className="text-lg">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 'overview' && (
            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-12 text-center">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analytics
              </h3>
              <p className="text-gray-600">
                Detailed {activeTab} analytics coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </RequireRole>
  )
}

function MetricCard({ title, value, icon, color }: {
  title: string
  value: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700'
  }

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}
