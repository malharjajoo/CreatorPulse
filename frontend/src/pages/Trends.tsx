import React from 'react';
import {
  TrendingUp,
  RefreshCw,
  Hash,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { useApi, useMutation } from '../hooks/useApi';
import { apiClient } from '../services/api';
import { Trend } from '../types';
import { formatRelativeTime } from '../utils/format';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const Trends: React.FC = () => {
  const { data: trends, loading, refetch } = useApi(() => apiClient.getTrends(), []);
  const fetchTrendsMutation = useMutation(apiClient.fetchTrends);

  const handleFetchTrends = async () => {
    try {
      await fetchTrendsMutation.mutate({});
      toast.success('Trends updated successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to fetch trends');
    }
  };

  const getTrendIcon = (index: number) => {
    if (index === 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (index === 1) return <ArrowUp className="h-4 w-4 text-blue-500" />;
    if (index === 2) return <ArrowUp className="h-4 w-4 text-purple-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (index: number) => {
    if (index === 0) return 'text-green-600 bg-green-50 border-green-200';
    if (index === 1) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (index === 2) return 'text-purple-600 bg-purple-50 border-purple-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Trending Topics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            AI-analyzed trends from your content sources.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <button
            onClick={() => refetch()}
            className="btn-secondary"
            disabled={loading}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </button>
          <button
            onClick={handleFetchTrends}
            disabled={fetchTrendsMutation.loading}
            className="btn-primary"
          >
            {fetchTrendsMutation.loading ? (
              <div className="spinner mr-2" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-2" />
            )}
            Fetch New Trends
          </button>
        </div>
      </div>

      {/* Trends List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner" />
        </div>
      ) : trends && trends.length > 0 ? (
        <div className="space-y-6">
          {/* Top Trends */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Top Trends
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Most popular topics from your content sources
              </p>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {trends.slice(0, 5).map((trend, index) => (
                  <div
                    key={trend.id}
                    className={cn(
                      'border rounded-lg p-4 transition-all hover:shadow-md',
                      getTrendColor(index)
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getTrendIcon(index)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900">
                            {trend.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {trend.summary}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {trend.keywords.slice(0, 5).map((keyword, keywordIndex) => (
                              <span
                                key={keywordIndex}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                <Hash className="h-3 w-3 mr-1" />
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-xs text-gray-500">
                        {formatRelativeTime(trend.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Trends */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                All Trends
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Complete list of analyzed trends
              </p>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {trends.map((trend, index) => (
                  <div
                    key={trend.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {trend.title}
                      </h4>
                      <span className="flex-shrink-0 text-xs text-gray-500">
                        #{index + 1}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {trend.summary}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {trend.keywords.slice(0, 3).map((keyword, keywordIndex) => (
                        <span
                          key={keywordIndex}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          <Hash className="h-3 w-3 mr-1" />
                          {keyword}
                        </span>
                      ))}
                      {trend.keywords.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{trend.keywords.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatRelativeTime(trend.created_at)}
                      </div>
                      <div className="flex items-center">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        {trend.keywords.length} keywords
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No trends yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add content sources and fetch trends to see what's trending.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={handleFetchTrends}
              disabled={fetchTrendsMutation.loading}
              className="btn-primary"
            >
              {fetchTrendsMutation.loading ? (
                <div className="spinner mr-2" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-2" />
              )}
              Fetch Trends
            </button>
            <a
              href="/settings"
              className="btn-secondary"
            >
              Add Sources
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trends;
