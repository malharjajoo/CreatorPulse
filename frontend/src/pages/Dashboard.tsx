import React from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  TrendingUp,
  Newspaper,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { apiClient } from '../services/api';
import { formatRelativeTime, formatNumber } from '../utils/format';
import { cn } from '../utils/cn';

const Dashboard: React.FC = () => {
  const { data: newsletters, loading: newslettersLoading, refetch: refetchNewsletters } = useApi(
    () => apiClient.getNewsletters(),
    []
  );

  const { data: trends, loading: trendsLoading, refetch: refetchTrends } = useApi(
    () => apiClient.getLatestTrends(),
    []
  );

  const { data: stats, loading: statsLoading } = useApi(
    () => apiClient.getNewsletterStats(),
    []
  );

  const latestNewsletter = newsletters?.[0];
  const recentTrends = trends?.slice(0, 3) || [];

  const handleGenerateNewsletter = async () => {
    try {
      await apiClient.generateNewsletter();
      refetchNewsletters();
      refetchTrends();
    } catch (error) {
      console.error('Error generating newsletter:', error);
    }
  };

  const handleRefreshTrends = async () => {
    try {
      await apiClient.fetchTrends();
      refetchTrends();
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your newsletters.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <button
            onClick={handleRefreshTrends}
            className="btn-secondary"
            disabled={trendsLoading}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', trendsLoading && 'animate-spin')} />
            Refresh Trends
          </button>
          <button
            onClick={handleGenerateNewsletter}
            className="btn-primary"
            disabled={newslettersLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Newsletter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Newspaper className="h-8 w-8 text-primary-600" />
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
                <CheckCircle className="h-8 w-8 text-green-600" />
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
                <TrendingUp className="h-8 w-8 text-purple-600" />
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
        {/* Latest Newsletter */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Latest Newsletter
            </h3>
          </div>
          <div className="card-body">
            {newslettersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="spinner" />
              </div>
            ) : latestNewsletter ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {formatRelativeTime(latestNewsletter.created_at)}
                  </span>
                  <span className={cn(
                    'badge',
                    latestNewsletter.sent_at ? 'badge-success' : 'badge-warning'
                  )}>
                    {latestNewsletter.sent_at ? 'Sent' : 'Draft'}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 line-clamp-4">
                    {latestNewsletter.content}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link
                    to={`/newsletters/${latestNewsletter.id}`}
                    className="btn-secondary btn-sm flex items-center"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Newspaper className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No newsletters yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Generate your first newsletter to get started.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleGenerateNewsletter}
                    className="btn-primary"
                    disabled={newslettersLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Newsletter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trending Topics */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Trending Topics
            </h3>
          </div>
          <div className="card-body">
            {trendsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="spinner" />
              </div>
            ) : recentTrends.length > 0 ? (
              <div className="space-y-4">
                {recentTrends.map((trend) => (
                  <div key={trend.id} className="border-l-4 border-primary-200 pl-4">
                    <h4 className="text-sm font-medium text-gray-900">{trend.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">{trend.summary}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {trend.keywords.slice(0, 3).map((keyword, index) => (
                        <span
                          key={index}
                          className="badge badge-gray"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <Link
                    to="/trends"
                    className="text-sm text-primary-600 hover:text-primary-500 flex items-center"
                  >
                    View all trends
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No trends yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add content sources to start tracking trends.
                </p>
                <div className="mt-6">
                  <Link to="/settings" className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sources
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/newsletters"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <div className="flex-shrink-0">
                <Newspaper className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Manage Newsletters</p>
                <p className="text-sm text-gray-500">View and edit your newsletters</p>
              </div>
            </Link>

            <Link
              to="/trends"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">View Trends</p>
                <p className="text-sm text-gray-500">Explore trending topics</p>
              </div>
            </Link>

            <Link
              to="/analytics"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-500">View performance metrics</p>
              </div>
            </Link>

            <Link
              to="/settings"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <div className="flex-shrink-0">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Settings</p>
                <p className="text-sm text-gray-500">Configure your preferences</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
