import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Edit,
  Trash2,
  Twitter,
  Youtube,
  Rss,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useApi, useMutation } from '../hooks/useApi';
import { apiClient } from '../services/api';
import { Source } from '../types';
import { formatRelativeTime } from '../utils/format';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

interface SourceForm {
  type: 'twitter' | 'youtube' | 'rss';
  handle: string;
  url?: string;
}

const Sources: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const { data: sources, loading, refetch } = useApi(() => apiClient.getSources(), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SourceForm>();

  const createMutation = useMutation(apiClient.createSource);
  const updateMutation = useMutation(apiClient.updateSource);
  const deleteMutation = useMutation(apiClient.deleteSource);

  const onSubmit = async (data: SourceForm) => {
    try {
      if (editingSource) {
        await updateMutation.mutate({ id: editingSource.id, ...data });
        toast.success('Source updated successfully');
      } else {
        await createMutation.mutate(data);
        toast.success('Source added successfully');
      }
      reset();
      setIsModalOpen(false);
      setEditingSource(null);
      refetch();
    } catch (error) {
      toast.error('Failed to save source');
    }
  };

  const handleEdit = (source: Source) => {
    setEditingSource(source);
    reset({
      type: source.type,
      handle: source.handle,
      url: source.url || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this source?')) {
      try {
        await deleteMutation.mutate(id);
        toast.success('Source deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete source');
      }
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'twitter':
        return <Twitter className="h-5 w-5 text-blue-500" />;
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 'rss':
        return <Rss className="h-5 w-5 text-orange-500" />;
      default:
        return <ExternalLink className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSourceUrl = (source: Source) => {
    switch (source.type) {
      case 'twitter':
        return `https://twitter.com/${source.handle}`;
      case 'youtube':
        return source.url || `https://youtube.com/channel/${source.handle}`;
      case 'rss':
        return source.url || source.handle;
      default:
        return source.url || '#';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Content Sources
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your content sources for newsletter generation.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => {
              setEditingSource(null);
              reset();
              setIsModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Source
          </button>
        </div>
      </div>

      {/* Sources List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner" />
        </div>
      ) : sources && sources.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <div key={source.id} className="card">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getSourceIcon(source.type)}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 capitalize">
                        {source.type}
                      </h3>
                      <p className="text-sm text-gray-500">@{source.handle}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(source)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(source.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <a
                    href={getSourceUrl(source)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-500 flex items-center"
                  >
                    View Source
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  Added {formatRelativeTime(source.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ExternalLink className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No sources yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first content source to start generating newsletters.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setEditingSource(null);
                reset();
                setIsModalOpen(true);
              }}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        {editingSource ? 'Edit Source' : 'Add New Source'}
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Source Type
                          </label>
                          <select
                            {...register('type', { required: 'Source type is required' })}
                            className="mt-1 input"
                          >
                            <option value="twitter">Twitter</option>
                            <option value="youtube">YouTube</option>
                            <option value="rss">RSS Feed</option>
                          </select>
                          {errors.type && (
                            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Handle/URL
                          </label>
                          <input
                            {...register('handle', { required: 'Handle is required' })}
                            type="text"
                            className="mt-1 input"
                            placeholder="e.g., @username, channel_id, or feed_url"
                          />
                          {errors.handle && (
                            <p className="mt-1 text-sm text-red-600">{errors.handle.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            URL (Optional)
                          </label>
                          <input
                            {...register('url')}
                            type="url"
                            className="mt-1 input"
                            placeholder="https://example.com/feed.xml"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            For YouTube channels or RSS feeds, provide the full URL
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createMutation.loading || updateMutation.loading}
                    className="btn-primary sm:ml-3 sm:w-auto"
                  >
                    {createMutation.loading || updateMutation.loading ? (
                      <div className="spinner mr-2" />
                    ) : null}
                    {editingSource ? 'Update Source' : 'Add Source'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingSource(null);
                      reset();
                    }}
                    className="btn-secondary mt-3 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sources;
