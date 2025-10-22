import React from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  ThumbsUp,
  ThumbsDown,
  Clock,
  RefreshCw,
  Download,
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { apiClient } from '../services/api';
import { formatNumber, formatRelativeTime } from '../utils/format';
import { cn } from '../utils/cn';

const Analytics: React.FC = () => {
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useApi(
    () => apiClient.getNewsletterStats(),
    []
  );

  const { data: newsletters, loading: newslettersLoading } = useApi(
    () => apiClient.getNewsletters(),
    []
  );

  const { data: trends, loading: trendsLoading } = useApi(
    () => apiClient.getTrends(),
    []
  );

  // Mock data for demonstration - in a real app, this would come from the API
  const mockData = {
    openRates: [
      { month: 'Jan', rate: 24.5 },
      { month: 'Feb', rate: 28.3 },
      { month: 'Mar', rate: 31.2 },
      { month: 'Apr', rate: 29.8 },
      { month: 'May', rate: 33.1 },
      { month: 'Jun', rate: 35.4 },
    ],
    clickRates: [
      { month: 'Jan', rate: 3.2 },
      { month: 'Feb', rate: 4.1 },
      { month: 'Mar', rate: 4.8 },
      { month: 'Apr', rate: 4.3 },
      { month: 'May', rate: 5.2 },
      { month: 'Jun', rate: 5.9 },
    ],
    engagement: [
      { type: 'Positive Feedback', count: stats?.positive_feedback || 0, color: 'green' },
      { type: 'Negative Feedback', count: stats?.negative_feedback || 0, color: 'red' },
      { type: 'Total Opens', count: Math.floor((stats?.sent || 0) * 0.3), color: 'blue' },
      { type: 'Total Clicks', count: Math.floor((stats?.sent || 0) * 0.05), color: 'purple' },
    ],
  };

  const getEngagementColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-100';
      case 'red': return 'text-red-600 bg-red-100';
      case 'blue': return 'text-blue-600 bg-blue-100';
      case 'purple': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your newsletter performance and engagement metrics.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <button
            onClick={() => refetchStats()}
            className="btn-secondary"
            disabled={statsLoading}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', statsLoading && 'animate-spin')} />
            Refresh
          </button>
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Mail className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Newsletters
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statsLoading ? '...' : stats?.total || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sent
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statsLoading ? '...' : stats?.sent || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Drafts
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statsLoading ? '...' : stats?.drafts || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ThumbsUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Positive Feedback
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statsLoading ? '...' : formatNumber(stats?.positive_feedback || 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Engagement Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Engagement Overview
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              User feedback and interaction metrics
            </p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {mockData.engagement.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={cn('badge', getEngagementColor(item.color))}>
                      {item.type}
                    </span>
                  </div>
                  <div className="text-lg font-medium text-gray-900">
                    {formatNumber(item.count)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Latest newsletter and trend activity
            </p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {newslettersLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="spinner" />
                </div>
              ) : newsletters && newsletters.length > 0 ? (
                newsletters.slice(0, 3).map((newsletter) => (
                  <div key={newsletter.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        Newsletter #{newsletter.id.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(newsletter.created_at)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={cn(
                        'badge',
                        newsletter.sent_at ? 'badge-success' : 'badge-warning'
                      )}>
                        {newsletter.sent_at ? 'Sent' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Open Rates */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Open Rates
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Newsletter open rates over time
            </p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {mockData.openRates.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${data.rate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {data.rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Click Rates */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Click Rates
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Newsletter click-through rates over time
            </p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {mockData.clickRates.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${data.rate * 6}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {data.rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trends Analysis */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Trends Analysis
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            AI-analyzed trends from your content sources
          </p>
        </div>
        <div className="card-body">
          {trendsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="spinner" />
            </div>
          ) : trends && trends.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trends.slice(0, 6).map((trend, index) => (
                <div key={trend.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {trend.title}
                    </h4>
                    <span className="flex-shrink-0 text-xs text-gray-500">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {trend.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{trend.keywords.length} keywords</span>
                    <span>{formatRelativeTime(trend.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No trends data</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add content sources to start tracking trends.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
